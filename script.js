class App {
    constructor() {
      this.notes = []; //hold notes
  
      this.$placeholder = document.querySelector('#placeholder')
      this.$form = document.querySelector("#form"); //$ added to recognize we are working with an html element
      this.$notes = document.querySelector('#notes');
      this.$noteTitle = document.querySelector("#note-title");
      this.$noteText = document.querySelector("#note-text");
      this.$formButtons = document.querySelector("#form-buttons");
  
      this.addEventListeners();
    }
  
    addEventListeners() {  //add method to app class
      document.body.addEventListener("click", event => {
        this.handleFormClick(event); //when using a class, use "this" to reference every method being called 
      });
  
      this.$form.addEventListener("submit", event => {
        event.preventDefault(); //prevent form refresh
        const title = this.$noteTitle.value;
        const text = this.$noteText.value;
        const hasNote = title || text; //need title or text for form to submit
        if (hasNote) {
          // add note
          this.addNote({ title, text }); //object shorthand {title: title, text: text}
        }
      });
    }
  
    handleFormClick(event) {
      const isFormClicked = this.$form.contains(event.target);  //contains will return a boolean
  
      if (isFormClicked) {
        this.openForm();
      } else {
        this.closeForm();
      }
    }
  
    openForm() { //method on our class
      this.$form.classList.add("form-open");
      this.$noteTitle.style.display = "block";
      this.$formButtons.style.display = "block";
    }
  
    closeForm() {
      this.$form.classList.remove("form-open");
      this.$noteTitle.style.display = "none";
      this.$formButtons.style.display = "none";
    }
  
    addNote(note) {
      const newNote = {
        title: note.title,
        text: note.text,
        color: "white",
        id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1 //if the length of notes array is > 0, add +1 to length of array, get id property, add 1 to increment id property
      };
      this.notes = [...this.notes, newNote]; //spread operator to make immutable array
      this.displayNotes() //display notes
    }

    displayNotes() {
        //hide placeholder if notes exist
        const hasNotes = this.notes.length > 0;
        this.$placeholder.style.display = hasNotes ? 'none' : 'flex' //if notes display notes, else display placeholder
    
        //display content by iterating over notes display
        this.$notes.innerHTML = this.notes.map(note => `     
        <div style="background: ${note.color};" class="note">
            <div class="${note.title && 'note-title'}">${note.title}</div>
            <div class="note-text">${note.text}</div>
            <div class="toolbar-container">
            <div class="toolbar">
              <img class="toolbar-color" src="https://icon.now.sh/palette">
              <img class="toolbar-delete" src="https://icon.now.sh/delete">
            </div>
          </div>
        </div>
        `);
    }
  }
  
  new App();
  