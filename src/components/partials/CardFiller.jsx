
function CardFiller(props) {
    if(props.LENGTH == 0 || props.LENGTH <= 5) 
    return(
        <>
            <div className='card card-extra'></div>
            <div className='card card-extra'></div>
            <div className='card card-extra'></div>
            <div className='card card-extra'></div>
            <div className='card card-extra'></div>
        </>
    )
    else return <></>
}

export default CardFiller