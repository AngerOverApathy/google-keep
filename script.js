class App {
   constructor() {
    this.$form = document.querySelector('#form') //$ added to recognize we are working with an html element
    this.$noteTitle = document.querySelector('#note-title')
    this.$formButtons = document.querySelector('#form-buttons')

    this.addEventListeners();
   } 

   addEventListeners() {   //add method to app class
      document.body.addEventListener('click', event => {
        this.handleFormClick(event); //when using a class, use "this" to reference every method being called 
      });
   }

   handleFormClick(event){
    const isFormClicked = this.$form.contains(event.target) //contains will return a boolean

    if (isFormClicked) {
        this.openForm()
    } else {
        this.closeForm()
    }
   }

   openForm() {      //method on our class
    this.$form.classList.add('form-open')
    this.$noteTitle.style.display = 'block'
    this.$formButtons.style.display = 'block'

   }

   closeForm() {
    this.$form.classList.remove('form-open')
    this.$noteTitle.style.display = 'none'
    this.$formButtons.style.display = 'none'
   }
}

new App()