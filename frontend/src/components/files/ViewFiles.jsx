import * as React from 'react'
import DownloadLayout from './details/DownloadLayout'
import UploadLayout from './details/UploadLayout'
function ViewFiles({ obtain, token }) {
    return (
        <div>
            <DownloadLayout obtain={obtain} token={token} />
            <UploadLayout obtain={obtain} token={token} />
        </div>
    )
}

export default ViewFiles