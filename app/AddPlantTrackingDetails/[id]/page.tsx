import React from 'react'

interface Props {
    id: string;
}
const page: React.FC<Props> = (props) => {
  return (
    <div>{props.id}</div>
  )
}

export default page