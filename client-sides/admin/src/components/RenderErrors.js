export let RenderErrors = ({ errors }) => {
    let renderErrors = () => errors?.map((error, idx) => <RenderError key={idx} error={error} />)
    return (
      <ol className='errors-list'>
        {renderErrors()}
      </ol>
    )
  }
  
  let RenderError = ({ error }) => {
    return (
      <li className='list-item'>`{error.param} -- {error.msg}`</li>
    )
  }