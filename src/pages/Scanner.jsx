import {QrReader} from 'react-qr-reader'
export default function Scanner(){
return(
<div className='container mt-5'>
<h2>QR Scanner</h2>
<QrReader/>
</div>
)
}