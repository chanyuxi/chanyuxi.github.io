import { QRCodeSVG } from 'qrcode.react'

interface QrCodeProps {
  value: string
}

export default function QrCode({ value }: QrCodeProps) {
  return (
    <QRCodeSVG
      bgColor="#ffffff"
      className="block"
      fgColor="#000000"
      size={144}
      value={value}
    />
  )
}
