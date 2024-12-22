import { Injectable } from '@nestjs/common';
import * as qrcode from 'qrcode'

@Injectable()
export class QrcodeService {
    async generateQRCode(data) {
        return await qrcode.toDataURL(data)  
    }
}
