const navSlide = () => {
        const boerie = document.querySelector('.boerie');
        const link_container = document.querySelector('.nav-links');
        const links = document.querySelectorAll('.nav-links li');

        boerie.addEventListener('click', ()=>{
            link_container.classList.toggle('nav-active');
        });


        links.forEach((link, index) => {
            if  (link.style.animation){
                 link.style.animation = ``;
            }else{
                link.style.animation = `navLinksFade 3.5s ease forwards ${index}s`;
            }

        });

        console.log(links[0].style);


}

navSlide();