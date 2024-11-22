#!/usr/bin/env python3

# (C) 2023 by Harald Welte <laforge@osmocom.org>
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 2 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

import unittest
import logging
import base64
from osmocom.utils import b2h, h2b

from pySim.esim.bsp import *
import pySim.esim.rsp as rsp
from pySim.esim import ActivationCode

from cryptography.hazmat.primitives.asymmetric import ec

class TestActivationCode(unittest.TestCase):
    def test_de_encode(self):
        STRS = ['1$SMDP.GSMA.COM$04386-AGYFT-A74Y8-3F815',
                '1$SMDP.GSMA.COM$04386-AGYFT-A74Y8-3F815$$1',
                '1$SMDP.GSMA.COM$04386-AGYFT-A74Y8-3F815$1.3.6.1.4.1.31746$1',
                '1$SMDP.GSMA.COM$04386-AGYFT-A74Y8-3F815$1.3.6.1.4.1.31746',
                '1$SMDP.GSMA.COM$$1.3.6.1.4.1.31746']
        for s in STRS:
            ac = ActivationCode.from_string(s)
            self.assertEqual(s, ac.to_string())


class TestECKA(unittest.TestCase):
    def test_mode51(self):
        curve = ec.SECP256R1()
        euicc_otpk_der = h2b('0400f7b8d71403f21d84b00cd9e561178d737d3f4d065e62fee279271298dd4f074794ab791b9939d4461296efe388aa26731064263af988b7d2c4d77da44801b5')
        smdp_otpk_der = h2b('04a27e2bdbd94dcf67d4c9ae5cb149d9d0f093be7a16dc41ec9db0318e4db72d09234a7d7631979a5d150eec40afe17ce41673df9d2f2e4246d60051c74eba7964')
        smdp_otsk_bytes = h2b('fb68a38ccedb69e15cbe03c256228998ac398587e5dc7117f948145c839d61a4')
        expected_shared_secret = h2b('c9a993dd4879a8f7161f2085410edd4f9652f1df37be097ba96ba2ca6be528fe')

        euicc_otpk = ec.EllipticCurvePublicKey.from_encoded_point(curve, bytes(euicc_otpk_der))
        smdp_otpk = ec.EllipticCurvePublicKey.from_encoded_point(curve, bytes(smdp_otpk_der))
        smdp_otsk = ec.derive_private_key(int.from_bytes(smdp_otsk_bytes, 'big'), curve)

        shared_secret = smdp_otsk.exchange(ec.ECDH(), euicc_otpk)

        self.assertEqual(shared_secret, expected_shared_secret)


class TestBSPdecode(unittest.TestCase):
    bpp_b64 = "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"



if __name__ == "__main__":
	unittest.main()