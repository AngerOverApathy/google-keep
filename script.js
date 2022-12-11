class App {
    constructor() {
      this.notes = JSON.parse(localStorage.getItem('notes')) || []; //hold notes
      this.title = '';
      this.text = '';
      this.id = '';
  
      this.$placeholder = document.querySelector('#placeholder')
      this.$form = document.querySelector("#form"); //$ added to recognize we are working with an html element
      this.$notes = document.querySelector('#notes');
      this.$noteTitle = document.querySelector("#note-title");
      this.$noteText = document.querySelector("#note-text");
      this.$formButtons = document.querySelector("#form-buttons");
      this.$formCloseButton = document.querySelector('#form-close-button')
      this.$modal = document.querySelector(".modal");
      this.$modalTitle = document.querySelector(".modal-title");
      this.$modalText = document.querySelector(".modal-text");
      this.$modalCloseButton = document.querySelector('.modal-close-button');
      this.$colorTooltip = document.querySelector('#color-tooltip');
        
      this.render()
      this.addEventListeners();
    }
  
    addEventListeners() {  //add method to app class
      document.body.addEventListener("click", event => {
        this.handleFormClick(event); //when using a class, use "this" to reference every method being called 
        this.selectNote(event)
        this.openModal(event); //receive event
        this.deleteNote(event)
      });

      document.body.addEventListener('mouseover', event => {
        this.openToolTip(event) //change note color with hover
      })

      document.body.addEventListener('mouseout', event => {
        this.closeToolTip(event);  
     });

      this.$colorTooltip.addEventListener('mouseover', function() { //not using arrow function so we can use 'this'
        this.style.display = 'flex'
        })
        
      this.$colorTooltip.addEventListener('mouseout', function() {
        this.style.display = 'none'
        })

      this.$colorTooltip.addEventListener('click', event => {
        const color = event.target.dataset.color;
        if (color) {
            this.editNoteColor()
        }
        })
  
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

      this.$formCloseButton.addEventListener('click', event => {
        event.stopPropagation(); //prevents event from propagating/bubbling up to handler for document body
        this.closeForm();
      })

      this.$modalCloseButton.addEventListener('click', event => {
        this.closeModal(event);  
      })
    }
  
    handleFormClick(event) {
      const isFormClicked = this.$form.contains(event.target);  //contains will return a boolean
  
      const title = this.$noteTitle.value;
      const text = this.$noteText.value;
      const hasNote = title || text;

      if (isFormClicked) {
        this.openForm();
      } else if (hasNote) {
        this.addNote({ title, text })
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
      this.$noteTitle.value = ''; //clears out input
      this.$noteText.value = ''; //clears out input
    }

    openModal(event) {
        if (event.target.matches('.toolbar-delete')) return; //if event matches toolbar delete element don't open modal

        if (event.target.closest('.note')) { //if user clicks close to note, open note
            this.$modal.classList.toggle('open-modal') //toggle css property
            this.$modalTitle.value = this.title;
            this.$modalText.value = this.text;
        }
    }

    closeModal(event) {
        this.editNote()
        this.$modal.classList.toggle('open-modal') //toggle off
    }

    openToolTip(event) { //change note color
        if (!event.target.matches('.toolbar-color')) return; 
        this.id = event.target.dataset.id //grab note id from note div
        const noteCoords = event.target.getBoundingClientRect() //gives specific hover coordinate info
        const horizontal = noteCoords.left + window.scrollX; //how much user has scrolled down page
        const vertical = noteCoords.top + window.scrollY - 20;
        this.$colorTooltip.style.transform = `translate(${horizontal}px, ${vertical}px)`;;
        this.$colorTooltip.style.display = 'flex';
    }

    closeToolTip(event) {
        if (!event.target.matches('.toolbar-color')) return;
        this.$colorTooltip.style.display = 'none';  
    }
  
    addNote({ title, text }) { //obj destructure, originally passed in 'note'
      const newNote = {
        title, //obj shorthand, as opposed to note.title
        text,
        color: "white",
        id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1 //if the length of notes array is > 0, add +1 to length of array, get id property, add 1 to increment id property
      };
      this.notes = [...this.notes, newNote]; //spread operator to make immutable array
      this.render() //display notes
      this.closeForm();
    }

    editNote() {
        const title = this.$modalTitle.value;
        const text = this.$modalText.value;
        this.notes = this.notes.map(note =>        //iterate through array of objects and update
            note.id === Number(this.id) ? { ...note, title, text } : note //if note id matches this.id update note, title, text, otherwise return note
        )
        this.render();
    }

    editNoteColor(color) {
        this.notes = this.notes.map(note =>        //iterate through array of objects and update
            note.id === Number(this.id) ? { ...note, color } : note //if note id matches this.id update note, title, text, otherwise return note
        )
        this.render();
    }

    selectNote(event) {
        const $selectedNote = event.target.closest('.note'); //returns closest element to note class
        if (!$selectedNote) return; //prevent 'children undefined' err due to unselected note
        const [$noteTitle, $noteText] = $selectedNote.children; //array destructuring to get individual values
        this.title = $noteTitle.innerText;
        this.text = $noteText.innerText;
        this.id = $selectedNote.dataset.id; //refers to data property in div
    }

    deleteNote(event) {
        event.stopPropagation() //prevent bubbling
        if (!event.target.matches('toolbar-delete')) return;
        const id = event.target.dataset.id;
        this.notes.filter(note => note.id !== Number(id)); //grab all notes with ids not equal to one being viewed
        this.render()
    }

    render() {
        this.saveNotes();
        this.displayNotes();
    }

    saveNotes() {
        localStorage.setItem('notes', JSON.stringify(this.notes))
    }

    displayNotes() {
        //hide placeholder if notes exist
        const hasNotes = this.notes.length > 0;
        this.$placeholder.style.display = hasNotes ? 'none' : 'flex' //if notes display notes, else display placeholder
    
        //display content by iterating over notes display //data property allows us to store data in html
        this.$notes.innerHTML = this.notes.map(note => `     
        <div style="background: ${note.color};" class="note" data-id="${note.id}"> 
            <div class="${note.title && 'note-title'}">${note.title}</div>
            <div class="note-text">${note.text}</div>
            <div class="toolbar-container">
            <div class="toolbar">
              <img class="toolbar-color" data-id=${note.id} src="https://icon.now.sh/palette">
              <img class="toolbar-delete" data-id=${note.id} src="https://icon.now.sh/delete">
            </div>
          </div>
        </div>
        `).join(""); //.join removes commas between arrays
    }
  }
  
  new App();
  