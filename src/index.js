import './scss/main.scss';
import { deflateRawSync } from 'zlib';

document.addEventListener( 'DOMContentLoaded', () => {

	//let url = 'https://my-json-server.typicode.com/Disasster27/db/db';
	let url = 'https://api.myjson.com/bins/cyod6';
	let amountElements = 15;
	let pages = 0;
	let product = [];
	const cartGoods = {};
	let totalAmount = 0;
	let totalPrice = 0;
	let minimalPrice = 0;
	let maximumPrise = 0;
	const range = document.querySelector( '.filter__range' );


	// получение всех товаров

	function getGoods ( url ) {
		fetch( url )
			.then( data => data.json() )
			.then( data => {
				countPages( data );
				initModal ( data );
				toArr ( data );
			} );
	};

	// отрисовывает цены в ползунке при изменении диапазона

	function drawPrice ( direction ) {
		let min = document.querySelector( '[data-value-min]' ).getAttribute( 'data-value-min' );
		let max = document.querySelector( '[data-value-max]' ).getAttribute( 'data-value-max' );
		let total = parseFloat( getComputedStyle( document.querySelector( '.range' ) ).width );
		let priceRange = max - min;
		let pr = document.querySelectorAll( '.item__price' );
		
		let part = parseFloat( direction == 'right' ? styleRight : styleLeft ) / ( total / 100 );  //
		
		let minPrice = Math.round( +min + ( priceRange * ( part / 100 ) ) );
		let maxPrice = Math.round( +max - ( priceRange * ( part / 100 ) ) ); //
		
		if ( direction == 'right' ) {
			document.querySelector( '[data-value-max]' ).textContent = maxPrice;
		} else {
			document.querySelector( '[data-value-min]' ).textContent = minPrice;
		};
		
		for ( let item of pr ) {
			if ( item.textContent > maxPrice || item.textContent < minPrice ) { //
				item.closest( '.item' ).classList.add( 'not-suitable' );
			} else {
				item.closest( '.item' ).classList.remove( 'not-suitable' );
			};
		};
	};
	
	// вешает события на ползунки

	range.addEventListener( 'mousedown', event => {
		if ( event.target.classList.contains( 'range__button-left' ) ) {
			let isMove = true;
			setPosition ( 'left', event, isMove );           //
		};
		if ( event.target.classList.contains( 'range__button-right' ) ) {
			let isMove = true;
			setPosition ( 'right', event, isMove );           //
		};
	} ) ;
	
	// координаты позиционирования ползунков

	let styleLeft = 0;
	let styleRight = 0;

	// устанавливает координаты ползунка при перемещении

	function setPosition ( direction, event, isMove ) {
		
		const btn = event.target;
		btn.style.zIndex = 7;
		let pagePos = event.pageX;
		let newPagePos;
		let newPosCss;		
		
		let posCss = btn.style[direction] ? parseFloat( btn.style[direction] ) : parseFloat( getComputedStyle( btn )[direction] );      

		btn.addEventListener( 'mousemove', event => {
			if ( isMove ) {

				newPagePos =  pagePos - event.pageX ;

				direction == 'right' ? (newPosCss = newPagePos < 0 ? posCss - Math.abs( newPagePos ) : posCss + Math.abs( newPagePos )) : (newPosCss = newPagePos < 0 ? posCss + Math.abs( newPagePos ) : posCss - Math.abs( newPagePos )) ;
          
				btn.style[direction] = newPosCss + 'px';   

				direction == 'right' ? styleRight = btn.style[direction] : styleLeft = btn.style[direction];
				
				setBetween ();
				drawPrice ( direction )
				console.log( styleLeft, styleRight )
				let limit = direction == 'right' ? styleRight : styleLeft;
				if ( parseFloat( limit ) < 0  ) {  
					isMove = false;
					limit = 0;
					return
				};
			}
		} );

		btn.addEventListener('mouseup', event => {
			isMove = false;
			btn.style.zIndex = 1;
		} );
	};
	 
	// отрисовывает полоску между ползунками

	function setBetween () {
		const between = document.querySelector( '.range__between' );	
		const totalWidth = parseFloat( getComputedStyle( document.querySelector( '.range' ) ).width );
		between.style.left = styleLeft;
		between.style.width = (totalWidth - parseFloat( styleLeft ) - parseFloat( styleRight )) + 'px';
	};

	// отмечает элементы со значением available : false

	const checkAvailable = document.querySelector( '.filter__checkbox' );
	checkAvailable.addEventListener( 'click', event => {
		if ( checkAvailable.checked ) {
			document.querySelectorAll( '[ data-available="false" ]' ).forEach( elem => {
				elem.classList.add( 'not-available' );
			} );
		} else {
			document.querySelectorAll( '.not-available' ).forEach( elem => {
				elem.classList.remove( 'not-available' );
			} );
		};
	} );
	
	

	// получение макс. и мин. значения цены
	
	function getPriceRange ( data, AllElem ) {
		
		minimalPrice = data[ 1 ].price;
		let keysArr = Object.keys(data);

		for ( let i = 0 ; i < keysArr.length - 1 ; i++) {

			let actualElem = data[ keysArr[i] ].price;
			let nextElem =  data[ keysArr[ (i + 1) ] ].price;
			
			if ( actualElem > nextElem ) {
				maximumPrise = actualElem > maximumPrise ? actualElem : maximumPrise;
				if ( nextElem < minimalPrice ) {
					minimalPrice = nextElem;
				};
			} else {
				maximumPrise = nextElem > maximumPrise ? nextElem : maximumPrise;
				if ( actualElem < minimalPrice ) {
					minimalPrice = actualElem;
				};
			};
		};
		setPriceLimit ();
	};

	// установка макс. и мин. значения цены
	
	function setPriceLimit () {
		range.querySelector( '[data-value-min]' ).setAttribute( 'data-value-min', minimalPrice );
		range.querySelector( '[data-value-min]' ).textContent = minimalPrice;
		range.querySelector( '[data-value-max]' ).setAttribute( 'data-value-max', maximumPrise );
		range.querySelector( '[data-value-max]' ).textContent = maximumPrise;

	};

	// отрисовка карточки товара

	function renderItem ( product ) {
		let itemBlock = document.querySelector( '.catalog' );

		let item = document.createElement( 'div' );
		item.classList.add( 'item' );
		item.setAttribute( 'data-available', `${ product.available }` )
		itemBlock.insertAdjacentElement( 'beforeend', item );
		item.innerHTML = `<a href="#" class="item__product">
							<img src="${ product.image }" alt="image" class="item__img">
							<div class="item__footer">
								<p class="item__named">${ product.title }</p>
								<p class="item__price">${ product.price }</p>
							</div>
						</a>
						<div class="item__add" data-item-id="${ product.id }">
							<a href="#!" class="add"><img src="img/Forma%201%20copy.svg" alt="">Add to Cart</a>
						</div>`;
		showItem( item );
		addToCartEvent( item, product );
	};

	// подсчёт колличества страниц в пагинации

	function countPages ( allGoods ) {
		const allElem = Object.keys( allGoods ).length;
		pages = Math.ceil( allElem/amountElements );
		setPagination ();
		getPriceRange( allGoods, allElem );
		addPaginationEvent( allGoods );
	};
	
	// отрисовка пагинации 

	function setPagination () {
		const paginationBlock = document.querySelector( '.pagination' );
		for ( let i = 1 ; i <= pages ; i++ ) {
			const pageNumber = document.createElement( 'a' );
			pageNumber.classList.add( 'pagination__page-number' );
			pageNumber.setAttribute( 'href', '#' );
			pageNumber.setAttribute( 'data-page-number', `${ i }` );
			pageNumber.textContent = i;
			paginationBlock.insertAdjacentElement( 'beforeend', pageNumber );
		};
		if ( pages > 1 ) {
			const pageNumber = document.createElement( 'a' );
			pageNumber.classList.add( 'pagination__page-number' );
			pageNumber.setAttribute( 'href', '#' );
			pageNumber.textContent = '»';
			paginationBlock.insertAdjacentElement( 'beforeend', pageNumber );
		};
	};

	// установка обработчиков на пагинации

	function addPaginationEvent( allGoods ) {
		
		document.querySelectorAll( '[data-page-number]' ).forEach( elem => {
			elem.addEventListener( 'click', event => {
				let start = amountElements * (elem.dataset.pageNumber - 1 );
				let end = amountElements * elem.dataset.pageNumber ;
				console.log( toArr ( allGoods ) )
				let arr = toArr ( allGoods ).slice( start, end );
				console.log( arr )
				reRenderItem ( arr );
			} );
		} );
	};

	// инициализация окна товара

	function initModal ( goods ) {
		document.querySelector( '.modal__add' ).addEventListener( 'click', ( event ) => {
			const interimElem =  forIn ( event.toElement.dataset.itemId, product );
			addToCart( interimElem );
			
			setQuantityList (interimElem.id);
		} );
		for ( let i = 1 ; i <= amountElements ; i++ ) {
			renderItem ( goods[ i ] );
		};
	};	

	// отрисовка колличества товара в окне товара

	function setQuantityList (id) {
		let quantity = forIn ( id, cartGoods ).quantity;
		
		const quan = document.querySelector( '.modal__quantity' );
		quan.textContent = quantity;
	};

	// перерисовка карточек товара

	function reRenderItem ( arr ) {
		document.querySelectorAll( '.item' ).forEach( elem => {
			elem.remove();
		} )
		for ( let i = 0 ; i < arr.length ; i++ ) {
			renderItem ( arr[ i ] );
		};
	};

	// получение массива всех товаров

	function toArr ( goods ) {
		let goodsArray = [];
		product.length = 0;
		console.log( goods )
		for ( let key in goods ) {
			product.push( goods[key] );
		};
		goodsArray = product  ;
		return goodsArray;
	};

	// установка обработчика на кнопке корточки товара для добавления в корзину 
	
	function addToCartEvent ( item, product ) {
		item.querySelector( `[ data-item-id="${ product.id }" ]` ).addEventListener( 'click', event => {
			addToCart (  product );
		} );
	};

	//добавление товара в корзину и подсчёт общего колличества

	function addToCart (  product ) {
		if ( cartGoods.hasOwnProperty( product.id ) ) {
			cartGoods[ product.id ].quantity += 1; 
			reRender( cartGoods[product.id] );
			
		} else {
			let { id, title, price, image } = product;
			cartGoods[ product.id ] = { id, title, price, image };
			cartGoods[ product.id ].quantity = 1;
			renderCart( cartGoods[product.id] );
		};

		totalAmount += 1;
		setTotalAmount ();
		calculateTotalPrice ( product.price );
		storage.save ( );
	};

	// отрисовка общего колличества товара в корзине
	
	function setTotalAmount () {
		document.querySelector( '.cart__quantity' ).textContent = totalAmount;
	};

	// отрисовка элемента товара в корзине

	function renderCart ( item ) {	
		const cartTotal = document.querySelector( '.cart__total' );	
		const cartItem = document.createElement( 'div' );
		cartItem.classList.add( 'cart__item' );
		cartItem.setAttribute( 'data-cart-id', `${ item.id }` )
		cartTotal.insertAdjacentElement( 'beforebegin', cartItem );
		cartItem.innerHTML = `<img src="${ item.image }" alt="image" class="cart__image">
								<div class="cart__title">
									<a href="#" class="cart__link">${ item.title }</a>
									<p class="cart__price"><span class="quantity">${ item.quantity }</span> ×  ${ item.price } total <span class="item-total"> ${ item.quantity * item.price }</span></p>
								</div>
								<div class="cart__delete"><i class="far fa-trash-alt"></i></div>`;
		deleteCart ( cartItem );
	};

	// удаление товара из корзины

	function deleteCart ( cartItem ) {
		const deleteBtn = cartItem.querySelector( '.cart__delete' );
		
		deleteBtn.addEventListener( 'click', event => {
			let quantity = cartGoods[ cartItem.dataset.cartId].quantity;
			cartItem.remove();
			totalAmount -= quantity;
			setTotalAmount ();

			let price = -(cartGoods[ cartItem.dataset.cartId].price * quantity);
			calculateTotalPrice ( price );
			
			delete cartGoods[event.target.parentNode.parentNode.dataset.cartId];
			storage.save();
		} );
	};

	// перерисовка в корзине колличества и и общей цены конкретного товара при их изменении 
	
	function reRender ( item ) {
		document.querySelector( `[ data-cart-id="${ item.id }" ]` ).querySelector( '.quantity' ).textContent = item.quantity;
		document.querySelector( `[ data-cart-id="${ item.id }" ]` ).querySelector( '.item-total' ).textContent = item.quantity * item.price;
	};

	// подсчёт общей цены всех таваров
	
	function calculateTotalPrice ( price ) {
		totalPrice += price;
		setTotalPrice ();
	};

	// отрисовка итоговой суммы к корзине

	function setTotalPrice () {
		document.querySelector( '.cart__total-price' ).textContent = totalPrice;
	};
	
	// сортировка по имени

	function sort () {
		let input = document.querySelector( '.filter__input' );
		let suitableElem =[];

		document.querySelector( '.filter__text' ).addEventListener( 'submit', event => {
			event.preventDefault();
			let inputValue = input.value.trim();
			const regex = new RegExp( inputValue, 'i' );
			suitableElem = product.filter( elem =>  regex.test( elem.title ) );
			console.log( product )
			console.log( suitableElem )
			if ( suitableElem.length ) {
				reRenderItem ( suitableElem );
			} else {
				alert( 'ничего не найдено' )
			}
			input.value = '';
		}  );
	};

	// вывод окна товара по нажатию на элемент товара

	function showItem ( item ) {
		item.addEventListener( 'click', event => {
			document.querySelector( '.modal__add' ).setAttribute( 'data-item-id', `${ item.children[1].dataset.itemId }` )
			if ( !event.target.classList.contains( 'add' ) ) {
				createListing( item, event );
				document.querySelector( 'body' ).classList.add( 'lock' );
			};
		} );
	};

	// отрисовка окна товара

	function createListing ( item, e ) {
		// const interimElem = product.filter( elem => elem.id == item.lastElementChild .dataset.itemId );
		const interimElem =  forIn ( e.toElement.offsetParent.lastElementChild.dataset.itemId, product );
		const modal = document.querySelector( '.modal' );

		modal.addEventListener( 'click', event => {
			if ( event.target.classList.contains( 'modal' ) ) {
				document.querySelector( 'body' ).classList.remove( 'lock' );
				modal.classList.add( 'invisible' );
			}
		} )

		modal.classList.remove( 'invisible' );
		setInfo( interimElem ); 
		modal.querySelector( '.modal__close' ).addEventListener( 'click', event => {
			document.querySelector( 'body' ).classList.remove( 'lock' );
			modal.classList.add( 'invisible' );
		} );
	};

	// установка параметров конкретного товара в окне товара

	function setInfo ( product ) {
		const image = document.querySelector( '.modal__image-main' );
		const title = document.querySelector( '.modal__title' );
		const descr = document.querySelector( '.modal__descr-text' );
		const price = document.querySelector( '.modal__price-current' );
		const available = document.querySelector( '.modal__available' );
		const quantity = document.querySelector( '.modal__quantity' );
		image.setAttribute( 'src', `${ product.image }` );
		title.firstElementChild.textContent = product.title;
		descr.textContent = product.descr;
		price.textContent = product.price;
		available.textContent = product.available ? 'available' : 'not available';
		quantity.textContent = forIn ( product.id, cartGoods ) ? forIn ( product.id, cartGoods ).quantity : '0';
	};

	// вместо фильтр:((

	function forIn ( id, object ) {
		let elem = null;
		for ( let key in object ) {
			if ( object[ key ].id == id ) {
				elem = object[ key ];
			} ;
		};
		return elem;
	};

	// localStorage

	const storage = {
		save () {

			const object = {
				goods : [],
			};

			for (const key in cartGoods) {
				object.goods.push( cartGoods[key] );
			};
			object.totalPrice = totalPrice;
			object.totalAmount = totalAmount;

			const json = JSON.stringify( object );
			localStorage.setItem( 'witeCode', json );
		},

		load () {
			if ( !localStorage.getItem( 'witeCode' ) ) {
				return
			}; 
			const object = JSON.parse( localStorage.getItem( 'witeCode' ) );
			
			for ( let i = 0 ; i < object.goods.length ; i++ ) {
				cartGoods[ object.goods[i].id ] = object.goods[i];
			}

			totalPrice = object.totalPrice;
			setTotalPrice ();
			totalAmount = object.totalAmount;
			setTotalAmount ();

			for ( let key in cartGoods ) {
				renderCart ( cartGoods[key] )
			};
		},
	};

	
	getGoods ( url );
	sort();
	storage.load();
} );




