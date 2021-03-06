import * as graphene from "graphene-pk11";
import {CryptoKey} from "./key";

import * as error from "./error";

import * as alg from "./algs/alg";
import * as aes from "./algs/aes";
import * as rsa from "./algs/rsa";
import * as ec from "./algs/ec";

/**
 * converts alg to Algorithm
 */
function prepare_algorithm(alg: TAlgorithm): Algorithm {
    let _alg: Algorithm = (typeof alg === "string") ? { name: alg } : alg;
    if (typeof _alg !== "object")
        throw new error.AlgorithmError(`Algorithm must be an Object`);
    if (!(_alg.name && typeof (_alg.name) === "string"))
        throw new error.AlgorithmError(`Missing required property name`);
    return _alg;
}

/**
 * Converts ArrayBuffer to Buffer
 * @param ab ArrayBuffer value wich must be converted to Buffer
 */
function ab2b(data: ArrayBufferView) {
    return new Buffer(data as Uint8Array);
}

function b2ab(data: Buffer): ArrayBuffer {
    return data.buffer;
}

export class SubtleCrypto implements NodeSubtleCrypto {
    protected session: graphene.Session;

    constructor(session: graphene.Session) {
        this.session = session;
    }

    generateKey(algorithm: TAlgorithm, extractable: boolean, keyUsages: string[]) {
        let that = this;
        return new Promise<CryptoKey | CryptoKeyPair>((resolve, reject) => {
            let _alg = prepare_algorithm(algorithm);

            let AlgClass: alg.IAlgorithmBase = null;
            switch (_alg.name.toLowerCase()) {
                case rsa.RsaPKCS1.ALGORITHM_NAME.toLowerCase():
                    AlgClass = rsa.RsaPKCS1;
                    break;
                case rsa.RsaPSS.ALGORITHM_NAME.toLowerCase():
                    AlgClass = rsa.RsaPSS;
                    break;
                case rsa.RsaOAEP.ALGORITHM_NAME.toLowerCase():
                    AlgClass = rsa.RsaOAEP;
                    break;
                case aes.AesGCM.ALGORITHM_NAME.toLowerCase():
                    AlgClass = aes.AesGCM;
                    break;
                case aes.AesCBC.ALGORITHM_NAME.toLowerCase():
                    AlgClass = aes.AesCBC;
                    break;
                case ec.Ecdsa.ALGORITHM_NAME.toLowerCase():
                    AlgClass = ec.Ecdsa;
                    break;
                case ec.Ecdh.ALGORITHM_NAME.toLowerCase():
                    AlgClass = ec.Ecdh;
                    break;
                default:
                    throw new error.AlgorithmError(error.ERROR_WRONG_ALGORITHM, _alg.name);
            }
            AlgClass.generateKey(that.session, _alg, extractable, keyUsages, (err: Error, key: CryptoKey | CryptoKeyPair) => {
                if (err)
                    reject(err);
                else
                    resolve(key);
            });
        });
    }

    sign(algorithm: TAlgorithm, key: CryptoKey, data: NodeCryptoBuffer) {
        let that = this;

        return new Promise<ArrayBuffer>((resolve, reject) => {

            let _data: Buffer = ab2b(data);
            let _alg = prepare_algorithm(algorithm);

            let AlgClass: alg.IAlgorithmBase = null;
            switch (_alg.name.toLowerCase()) {
                case rsa.RsaPKCS1.ALGORITHM_NAME.toLowerCase():
                    AlgClass = rsa.RsaPKCS1;
                    break;
                case rsa.RsaPSS.ALGORITHM_NAME.toLowerCase():
                    AlgClass = rsa.RsaPSS;
                    break;
                case ec.Ecdsa.ALGORITHM_NAME.toLowerCase():
                    AlgClass = ec.Ecdsa;
                    break;
                default:
                    throw new error.AlgorithmError(error.ERROR_WRONG_ALGORITHM, _alg.name);
            }
            AlgClass.sign(that.session, _alg, key, _data, (err, signature) => {
                if (err)
                    reject(err);
                else
                    resolve(b2ab(signature));
            });

        });
    }

    verify(algorithm: TAlgorithm, key: CryptoKey, signature: NodeCryptoBuffer, data: NodeCryptoBuffer) {
        let that = this;

        return new Promise<boolean>((resolve, reject) => {
            let _signature = ab2b(signature);
            let _data = ab2b(data);
            let _alg = prepare_algorithm(algorithm);

            let AlgClass: alg.IAlgorithmBase = null;
            switch (_alg.name.toLowerCase()) {
                case rsa.RsaPKCS1.ALGORITHM_NAME.toLowerCase():
                    AlgClass = rsa.RsaPKCS1;
                    break;
                case rsa.RsaPSS.ALGORITHM_NAME.toLowerCase():
                    AlgClass = rsa.RsaPSS;
                    break;
                case ec.Ecdsa.ALGORITHM_NAME.toLowerCase():
                    AlgClass = ec.Ecdsa;
                    break;
                default:
                    throw new error.AlgorithmError(error.ERROR_WRONG_ALGORITHM, _alg.name);
            }
            AlgClass.verify(that.session, _alg, key, _signature, _data, (err, verify) => {
                if (err)
                    reject(err);
                else
                    resolve(verify);
            });
        });
    }

    encrypt(algorithm: TAlgorithm, key: CryptoKey, data: NodeCryptoBuffer) {
        let that = this;

        return new Promise<ArrayBuffer>((resolve, reject) => {
            let _data = ab2b(data);
            let _alg = prepare_algorithm(algorithm);

            let AlgClass: alg.IAlgorithmBase = null;
            switch (_alg.name.toLowerCase()) {
                case rsa.RsaOAEP.ALGORITHM_NAME.toLowerCase():
                    AlgClass = rsa.RsaOAEP;
                    break;
                case aes.AesGCM.ALGORITHM_NAME.toLowerCase():
                    AlgClass = aes.AesGCM;
                    break;
                case aes.AesCBC.ALGORITHM_NAME.toLowerCase():
                    AlgClass = aes.AesCBC;
                    break;
                default:
                    throw new error.AlgorithmError(error.ERROR_WRONG_ALGORITHM, _alg.name);
            }
            AlgClass.encrypt(that.session, _alg, key, _data, (err, enc) => {
                if (err)
                    reject(err);
                else
                    resolve(b2ab(enc));
            });
        });
    }

    decrypt(algorithm: TAlgorithm, key: CryptoKey, data: ArrayBufferView) {
        let that = this;

        return new Promise<ArrayBuffer>((resolve, reject) => {
            let _data = ab2b(data);
            let _alg = prepare_algorithm(algorithm);

            let AlgClass: alg.IAlgorithmBase = null;
            switch (_alg.name.toLowerCase()) {
                case rsa.RsaOAEP.ALGORITHM_NAME.toLowerCase():
                    AlgClass = rsa.RsaOAEP;
                    break;
                case aes.AesGCM.ALGORITHM_NAME.toLowerCase():
                    AlgClass = aes.AesGCM;
                    break;
                case aes.AesCBC.ALGORITHM_NAME.toLowerCase():
                    AlgClass = aes.AesCBC;
                    break;
                default:
                    throw new error.AlgorithmError(error.ERROR_WRONG_ALGORITHM, _alg.name);
            }
            AlgClass.decrypt(that.session, _alg, key, _data, (err, enc) => {
                if (err)
                    reject(err);
                else
                    resolve(b2ab(enc));
            });
        });
    }

    wrapKey(format: string, key: CryptoKey, wrappingKey: CryptoKey, wrapAlgorithm: TAlgorithm) {
        let that = this;

        return new Promise<ArrayBuffer>((resolve, reject) => {
            let _alg = prepare_algorithm(wrapAlgorithm);
            let KeyClass: alg.IAlgorithmBase;
            switch (_alg.name) {
                case aes.ALG_NAME_AES_CBC:
                    KeyClass = aes.AesCBC;
                    break;
                case aes.ALG_NAME_AES_GCM:
                    KeyClass = aes.AesGCM;
                    break;
                case rsa.ALG_NAME_RSA_OAEP:
                    KeyClass = rsa.RsaOAEP;
                    break;
                default:
                    throw new error.AlgorithmError(error.ERROR_WRONG_ALGORITHM, _alg.name);
            }

            KeyClass.wrapKey(that.session, format, key, wrappingKey, _alg, (err: Error, wkey: Buffer) => {
                if (err)
                    reject(err);
                else
                    resolve(b2ab(wkey));
            });
        });
    }

    unwrapKey(format: string, wrappedKey: NodeCryptoBuffer, unwrappingKey: CryptoKey, unwrapAlgorithm: TAlgorithm, unwrappedKeyAlgorithm: TAlgorithm, extractable: boolean, keyUsages: string[]) {
        let that = this;

        return new Promise<CryptoKey>((resolve, reject) => {
            let KeyClass: alg.IAlgorithmBase;
            switch (unwrappingKey.algorithm.name) {
                case aes.ALG_NAME_AES_CBC:
                    KeyClass = aes.AesCBC;
                    break;
                case aes.ALG_NAME_AES_GCM:
                    KeyClass = aes.AesGCM;
                    break;
                case rsa.ALG_NAME_RSA_OAEP:
                    KeyClass = rsa.RsaOAEP;
                    break;
                default:
                    throw new error.AlgorithmError(error.ERROR_WRONG_ALGORITHM, unwrappingKey.algorithm.name);
            }
            let wrappedKeyBuffer = ab2b(wrappedKey);
            KeyClass.unwrapKey(that.session, format, wrappedKeyBuffer, unwrappingKey, unwrapAlgorithm, unwrappedKeyAlgorithm, extractable, keyUsages, (err: Error, uwkey: CryptoKey) => {
                if (err)
                    reject(err);
                else
                    resolve(uwkey);
            });
        });
    }

    deriveKey(algorithm: TAlgorithm, baseKey: CryptoKey, derivedKeyType: TAlgorithm, extractable: boolean, keyUsages: string[]) {
        let that = this;

        return new Promise<CryptoKey>((resolve, reject) => {
            let _alg1 = prepare_algorithm(algorithm);
            let _alg2 = prepare_algorithm(derivedKeyType);

            let AlgClass: alg.IAlgorithmBase = null;
            switch (_alg1.name.toLowerCase()) {
                case ec.Ecdh.ALGORITHM_NAME.toLowerCase():
                    AlgClass = ec.Ecdh;
                    break;
                default:
                    throw new error.AlgorithmError(error.ERROR_WRONG_ALGORITHM, _alg1.name);
            }
            AlgClass.deriveKey(that.session, algorithm, baseKey, derivedKeyType, extractable, keyUsages, (err, key) => {
                if (err)
                    reject(err);
                else
                    resolve(key);
            });
        });
    }

    exportKey(format: string, key: CryptoKey) {
        let that = this;

        return new Promise<JWK | ArrayBuffer>((resolve, reject) => {
            let KeyClass: alg.IAlgorithmBase;
            switch (key.algorithm.name) {
                case aes.ALG_NAME_AES_CBC:
                    KeyClass = aes.AesCBC;
                    break;
                case aes.ALG_NAME_AES_GCM:
                    KeyClass = aes.AesGCM;
                    break;
                case rsa.ALG_NAME_RSA_PKCS1:
                    KeyClass = rsa.RsaPKCS1;
                    break;
                case rsa.ALG_NAME_RSA_OAEP:
                    KeyClass = rsa.RsaOAEP;
                    break;
                case ec.ALG_NAME_ECDSA:
                    KeyClass = ec.Ecdsa;
                    break;
                case ec.ALG_NAME_ECDH:
                    KeyClass = ec.Ecdh;
                    break;
                default:
                    throw new error.AlgorithmError(error.ERROR_WRONG_ALGORITHM, key.algorithm.name);
            }
            KeyClass.exportKey(that.session, format, key, (err, data) => {
                if (err)
                    reject(err);
                else {
                    if (Buffer.isBuffer(data)) {
                        // raw | spki | pkcs8
                        resolve(data.buffer);
                    }
                    else
                        // jwk
                        resolve(data);
                }
            });
        });
    }

    importKey(format: string, keyData: JWK | NodeCryptoBuffer, algorithm: TAlgorithm, extractable: boolean, keyUsages: string[]) {
        let that = this;

        return new Promise<CryptoKey>((resolve, reject) => {
            let _alg = prepare_algorithm(algorithm);
            let KeyClass: alg.IAlgorithmBase;
            switch (_alg.name) {
                case aes.ALG_NAME_AES_CBC:
                    KeyClass = aes.AesCBC;
                    break;
                case aes.ALG_NAME_AES_GCM:
                    KeyClass = aes.AesGCM;
                    break;
                case rsa.ALG_NAME_RSA_PKCS1:
                    KeyClass = rsa.RsaPKCS1;
                    break;
                case rsa.ALG_NAME_RSA_OAEP:
                    KeyClass = rsa.RsaOAEP;
                    break;
                case ec.ALG_NAME_ECDSA:
                    KeyClass = ec.Ecdsa;
                    break;
                case ec.ALG_NAME_ECDH:
                    KeyClass = ec.Ecdh;
                    break;
                default:
                    throw new error.AlgorithmError(error.ERROR_WRONG_ALGORITHM, _alg.name);
            }

            let data: any;
            if (keyData instanceof ArrayBuffer || ArrayBuffer.isView(keyData)) {
                // raw | pkcs8 | spki
                data = ab2b(keyData);
            }
            else
                // jwk
                data = keyData;

            KeyClass.importKey(that.session, format, data, _alg, extractable, keyUsages, (err: Error, key: CryptoKey) => {
                if (err)
                    reject(err);
                else
                    resolve(key);
            });
        });
    }

    deriveBits(algorithm: TAlgorithm, baseKey: CryptoKey, length: number) {
        let that = this;
        return new Promise<ArrayBuffer>((resolve, reject) => {
            reject(new Error("Method is not implemented"));
        });
    }

    digest(algorithm: TAlgorithm, data: NodeCryptoBuffer) {
        let that = this;
        return new Promise<ArrayBuffer>((resolve, reject) => {
            let alg = prepare_algorithm(algorithm);
            let hashAlg = alg.name.toUpperCase();
            switch (hashAlg) {
                case "SHA-1":
                case "SHA-224":
                case "SHA-256":
                case "SHA-384":
                case "SHA-512":
                    hashAlg = hashAlg.replace("-", "");
            }
            let digest = that.session.createDigest(hashAlg);
            let buf = ab2b(data);
            digest.once(buf, (err, md) => {
                if (err)
                    reject(err);
                else
                    resolve(b2ab(md));
            });
        });
    }

}