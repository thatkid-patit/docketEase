import { useEffect } from 'react'

function BurgerMenu() {

    const toggleBurger = () => {
        document.querySelector(".sidebar-container").classList.toggle("toggle");
        document.querySelector(".page-container").classList.toggle("toggle");
        document.querySelector(".burger").classList.toggle("toggle");
    }

    return(
        <div className='burger'>
            <i className="icon-reorder" onClick={toggleBurger}></i>
        </div>
    );
}

export default BurgerMenu