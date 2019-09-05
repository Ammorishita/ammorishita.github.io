
const flipBook = {
	init() {
		this.settings();
		this.setUpEvents();
		this.buttonEvents();
	},
	settings() {
		this.buttons = document.querySelectorAll('.pager');
	},
	buttonEvents() {
		for(let i=0;i<this.buttons.length;i++) {
			this.buttons[i].addEventListener('click', this.turnPage.bind(this));
		}
	},
	setUpEvents() {
		const books = document.querySelectorAll('.book');
		let startX = 0;
		let endX = 0;
		const threshold = 1000;
		const swipeStart = function (e) {
			e.preventDefault();
			if (e.touches) {
				startX = e.touches[0].screenX
			} else {
				startX = e.screenX;
			}
			setTimeout(() => {
				startX = 0;
			}, threshold);
		}
		const swipeEnd = function (e) {
			e.preventDefault();
			endX = (e.changedTouches)
				? e.changedTouches[0].screenX
				: e.screenX;
			const diff = Math.abs(endX - startX);
			const activeBtn = document.querySelector(".pager.active");
			if (startX > 0 && diff > 50 && endX > startX) {
				const prev = activeBtn.previousElementSibling;
				if (prev) {
					prev.click();
				}
			} else if (startX > 0 && diff > 50 && endX < startX) {
				const next = activeBtn.nextElementSibling;
				if (next) {
					next.click();
				}
			}
		}
		for (let i = 0; i < books.length; i++) {
			books[i].addEventListener("mousedown", swipeStart);
			books[i].addEventListener("mouseup", swipeEnd);
			books[i].addEventListener("touchstart", swipeStart);
			books[i].addEventListener("touchend", swipeEnd);
		}
	},
	removeClones() {
		const clones = document.querySelectorAll(".book--clone");
		for (let i = 0; i < clones.length; i++) {
			clones[i].remove();
		}
	},
	setPages() {
		const books = document.querySelectorAll(".book");
		for (let i = 0; i < books.length; i++) {
			books[i].classList.value = 'book';
		}
	},
	cloneBook(book, position, bookSize) {
		const bookClone = book.cloneNode(true);
		const pages = bookClone.querySelectorAll('.book__page');
		const isDesktop = window.matchMedia('(min-width: 48em)').matches;
		if (!isDesktop) {
			bookClone.style.width = Math.floor(bookSize / 2) + 'px';
			for (let i = 0; i < pages.length; i++) {
				pages[i].style.width = bookSize + 'px';
			}
		}
		bookClone.classList.value = 'book book--clone book-hidden';
		bookClone.classList.add(position);
		return bookClone;
	},
	turnPage(event) {
		const target = event.target;
		const targetIndex = Number(target.getAttribute('data-id'));
		const targetBook = document.querySelector(`.book[data-id="${targetIndex}"]`);
		const buttons = document.querySelectorAll(".pager");
		const currentBook = document.querySelector(".book.current-book");
		const activeButton = document.querySelector(".pager.active");
		const activeIndex = Number(activeButton.getAttribute('data-id'));
		const gameContainer = document.querySelector('.book-container');
		const bookSize = currentBook.getBoundingClientRect().width;
		buttons.forEach((item) => {
			item.classList.remove('active');
		});
		//set active button styling
		target.classList.add('active');
		//check if were going forward or previous
		const direction = (activeIndex < targetIndex)
			? "forward"
			: (activeIndex === targetIndex)
				? "same"
				: "previous";
		//set up classes for pages before and after
		const timing = 1000;
		const half = Math.floor(timing / 2);
		if (direction !== 'same') {
			const leftPageClone = this.cloneBook(currentBook, 'left', bookSize);
			const rightPageClone = this.cloneBook(currentBook, 'right', bookSize);
			const targetPageClone = this.cloneBook(targetBook, 'target', bookSize);
			gameContainer.appendChild(targetPageClone);
			gameContainer.appendChild(leftPageClone);
			gameContainer.appendChild(rightPageClone);
	
			setTimeout(() => {
				//The clones are originally hidden to prevent fouc.
				const clones = document.querySelectorAll('.book--clone');
				for (let i = 0; i < clones.length; i++) {
					clones[i].classList.remove('book-hidden');
				}
				gameContainer.classList.value = 'book-container';
				gameContainer.classList.add(direction);
				targetBook.classList.add('temp-book');
			}, 50);
			setTimeout(() => {
				//at the half way point
				//hide the current rotating page
				//set the target page as the top level page z index
				if (direction === 'forward') {
					rightPageClone.classList.add('book-hidden');
					targetPageClone.classList.add('top-book');
				} else if (direction === 'previous') {
					leftPageClone.classList.add('book-hidden');
					targetPageClone.classList.add('top-book');
				}
			}, half);
	
			setTimeout(() => {
				//remove the clones
				//revert all classes on the books
				this.removeClones();
				this.setPages();
				targetBook.classList.add('current-book');
			}, timing);
		}
	}
}
flipBook.init();