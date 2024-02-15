import * as React from 'react'
import { Button } from 'antd';

import PreAlertEdit from './details/PreAlertEdit';
import PreAlertDisplay from './details/PreAlertDisplay';
function ViewPreAlert({ obtain, token, selected }) {

  const [isEdit, setEdit] = React.useState(true)
  function handleEdit() {
    setEdit(!isEdit)
  }

  return (
    <>
      <div className='float-end pb-1' hidden={selected === 'Pre Alert' ? false : true}>
        <Button type='link' onClick={handleEdit}>
          {isEdit ? 'Edit' : 'Cancel Edit'}
        </Button>
      </div>
      <div hidden={obtain.userKey === token.userKey && !isEdit ? false : true}>
        <PreAlertEdit obtain={obtain} token={token} />
      </div>
      <div hidden={isEdit ? false : true}>
        <PreAlertDisplay obtain={obtain} token={token} />
      </div>
    </>
  )
}

export default ViewPreAlert