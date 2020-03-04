import './scss/main.scss';

document.addEventListener( 'DOMContentLoaded', () => {

	//let url = 'https://my-json-server.typicode.com/Disasster27/db/db';
	let url = 'https://api.myjson.com/bins/152mue';
	let amountElements = 15;
	let pages = 0;
	const product = [];
	const cartGoods = {
		totalAmount : 0,
	};
	let minimalPrice = 0;
	let maximumPrise = 0;
	const range = document.querySelector( '.filter__range' );
	
	
	function drawPriceLeft () {
		let min = document.querySelector( '[data-value-min]' ).getAttribute( 'data-value-min' );
		let max = document.querySelector( '[data-value-max]' ).getAttribute( 'data-value-max' );
		let totall = parseFloat( getComputedStyle( document.querySelector( '.range' ) ).width );
		let priceRange = max - min;
		let pr = document.querySelectorAll( '.item__price' );
		
		
		let part = parseFloat( styleLeft ) / ( totall / 100 ); 
		let minPrice = Math.round( +min + ( priceRange * ( part / 100 ) ) );
		

		
		document.querySelector( '[data-value-min]' ).textContent = minPrice;
		
		
		
		
		for ( let item of pr ) {
			if ( item.textContent < minPrice ) {
//				console.log( item )
				item.closest( '.item' ).classList.add( 'not-available' );
			} else {
				item.closest( '.item' ).classList.remove( 'not-available' );
			};
		};	
	};
	
	function drawPriceRight () {
		let min = document.querySelector( '[data-value-min]' ).getAttribute( 'data-value-min' );
		let max = document.querySelector( '[data-value-max]' ).getAttribute( 'data-value-max' );
		let totall = parseFloat( getComputedStyle( document.querySelector( '.range' ) ).width );
		let priceRange = max - min;
		let pr = document.querySelectorAll( '.item__price' );
		
		
		let part = parseFloat( styleRight ) / ( totall / 100 ); 
		let maxPrice = Math.round( max - ( priceRange * ( part / 100 ) ) );
		
		
		document.querySelector( '[data-value-max]' ).textContent = maxPrice;
		
		
		for ( let item of pr ) {
			if ( item.textContent > maxPrice ) {
//				console.log( item )
				item.closest( '.item' ).classList.add( 'not-available' );
			} else {
				item.closest( '.item' ).classList.remove( 'not-available' );
			};
		};
		
		
	};
	
	range.addEventListener( 'mousedown', event => {
		if ( event.target.classList.contains( 'range__button-left' ) ) {
			let isMove = true;
			setPositionLeft( event, isMove );
		};
		if ( event.target.classList.contains( 'range__button-right' ) ) {
			let isMove = true;
			setPositionRight( event, isMove );
		};
	} ) ;
	
	let styleLeft = 0;
	let styleRight = 0;
	
	function setPositionLeft ( event, isMove ) {
		
		const btn = event.target;
		btn.style.zIndex = 7;
		let pagePos = event.pageX;
		let newPagePos;
		let newPosCss;
		
		
		let posCss = btn.style.left ? parseFloat( btn.style.left ) : parseFloat( getComputedStyle( btn ).left );
		
		
		
		btn.addEventListener( 'mousemove', event => {
			if ( isMove ) {
				newPagePos =  pagePos - event.pageX ;
				newPosCss = newPagePos < 0 ? posCss + Math.abs( newPagePos ) : posCss - Math.abs( newPagePos );
				btn.style.left = newPosCss + 'px';
				styleLeft = btn.style.left;
				
				setBetween(); 
				drawPriceLeft();		
				if ( parseFloat( styleLeft ) < 0  ) {
					isMove = false;
					return
				};
			}
		} );

		btn.addEventListener('mouseup', event => {
			isMove = false;
			btn.style.zIndex = 1;
		} );	
	};
	
	function setPositionRight ( event, isMove ) {
		
		const btn = event.target;
		btn.style.zIndex = 7;
		let pagePos = event.pageX;
		let newPagePos;
		let newPosCss;
		
		let posCss = btn.style.right ? parseFloat( btn.style.right ) : parseFloat( getComputedStyle( btn ).right );
		
		
		
		btn.addEventListener( 'mousemove', event => {
			if ( isMove ) {
				newPagePos =  pagePos - event.pageX ;
				newPosCss = newPagePos < 0 ? posCss - Math.abs( newPagePos ) : posCss + Math.abs( newPagePos );
				btn.style.right = newPosCss + 'px';
				styleRight = btn.style.right;
				
				setBetween ();
				drawPriceRight();
				if ( parseFloat( styleRight ) < 0  ) {
					isMove = false;
					return
				};
			}
		} );

		btn.addEventListener('mouseup', event => {
			isMove = false;
			btn.style.zIndex = 1;
		} );
	};
	
	function setBetween () {
		const between = document.querySelector( '.range__between' );	
		const totallWidth = parseFloat( getComputedStyle( document.querySelector( '.range' ) ).width );
		between.style.left = styleLeft;
		between.style.width = (totallWidth - parseFloat( styleLeft ) - parseFloat( styleRight )) + 'px';
	};

	
	const checkAvailable = document.querySelector( '.filter__checkbox' );
	checkAvailable.addEventListener( 'click', event => {
		if ( checkAvailable.checked ) {
			document.querySelectorAll( '[ data-available="false" ]' ).forEach( elem => {
				elem.classList.add( 'not-available' )
			} );
		} else {
			document.querySelectorAll( '.not-available' ).forEach( elem => {
				elem.classList.remove( 'not-available' )
			} );
		};
	} );
	

	function getGoods ( url ) {
		fetch( url )
			.then( data => data.json() )
			.then( data => {
				countPages( data );
				renderCatalog ( data );
			} );
	};
	
	function getPriceRange ( data, AllElem ) {
		
		minimalPrice = data[ 4 ].price;
		
		for ( let i = 1 ; i < AllElem ; i++) {
//			console.log( data[ i ].price )
			
			if ( data[ i ].price > data[ i + 1 ].price ) {
				maximumPrise = data[ i ].price;
				if ( data[ i + 1 ].price < minimalPrice ) {
					minimalPrice = data[ i + 1 ].price;
				};
			} else {
				maximumPrise = data[ i + 1 ].price;
				if ( data[ i ].price < minimalPrice ) {
					minimalPrice = data[ i ].price;
				};
			};
		};
		
		
		console.log( maximumPrise, minimalPrice );
		setPriceLimit ();
	};
	
	function setPriceLimit () {
		range.querySelectorAll( '[data-value-min]' );
	
		range.querySelector( '[data-value-min]' ).setAttribute( 'data-value-min', minimalPrice )
		range.querySelector( '[data-value-min]' ).textContent = minimalPrice;
		
		range.querySelectorAll( '[data-value-max]' );
	
		range.querySelector( '[data-value-max]' ).setAttribute( 'data-value-max', maximumPrise )
		range.querySelector( '[data-value-max]' ).textContent = maximumPrise;

	}

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
						<div class="item__add" data-id="${ product.id }">
							<a href="#" class="add"><img src="img/Forma%201%20copy.svg" alt="">Add to Cart</a>
						</div>`;
		
		addToCartEvent( product );
	};

	function renderCatalog ( goods ) {
		for ( let i = 1 ; i <= amountElements ; i++ ) {
			renderItem ( goods[ i ] )
		}
	}	

	function countPages ( allGoods ) {
		const allElem = Object.keys( allGoods ).length;
		pages = Math.ceil( allElem/amountElements );
		setPagination ();
		getPriceRange( allGoods, allElem );
	};
	
	function setPagination () {
		const paginationBlock = document.querySelector( '.pagination' );
		for ( let i = 1 ; i <= pages ; i++ ) {
			const pageNumber = document.createElement( 'a' );
			pageNumber.classList.add( 'pagination__page-number' );
			pageNumber.setAttribute( 'href', '#' );
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
	
	function addToCartEvent ( product ) {
//		console.log( product )
		document.querySelector( `[ data-id="${ product.id }" ]` ).addEventListener( 'click', event => {
			if ( cartGoods.hasOwnProperty( product.id ) ) {
				cartGoods[ product.id ].quantity += 1; 
				reRender( cartGoods[product.id] );
			} else {
				let { id, title, price, image } = product;
				cartGoods[ product.id ] = { id, title, price, image };
				cartGoods[ product.id ].quantity = 1;
				renderCart( cartGoods[product.id] );
			};
			cartGoods.totalAmount += 1;
			setTotalAmount ();
			calculateTotalPrice ( product.price );
		} );
	};
	
	function setTotalAmount () {
		document.querySelector( '.cart__quantity' ).textContent = cartGoods.totalAmount;
	}

	function renderCart ( item ) {
//		console.log(item)
		const cart = document.querySelector( '.cart__list' );	
		const cartTotal = document.querySelector( '.cart__total' );	
		const cartItem = document.createElement( 'div' );
		cartItem.classList.add( 'cart__item' );
		cartItem.setAttribute( 'data-id', `${ item.id }` )
		cartTotal.insertAdjacentElement( 'beforebegin', cartItem );
		cartItem.innerHTML = `<img src="${ item.image }" alt="image" class="cart__image">
								<div class="cart__title">
									<a href="#" class="cart__link">${ item.title }</a>
									<p class="cart__price"><span class="quantity">${ item.quantity }</span> ×  ${ item.price }</p>
								</div>
								<div class="cart__delete"><i class="far fa-trash-alt"></i></div>`;
		deleteCart ( cartItem );
	};

	function deleteCart ( cartItem ) {
		
		const deleteBtn = cartItem.querySelector( '.cart__delete' );
		
		deleteBtn.addEventListener( 'click', event => {

			let quantity = cartGoods[ cartItem.dataset.id].quantity;
			cartItem.remove();
			cartGoods.totalAmount -= quantity;
			setTotalAmount ();
			let price = -(cartGoods[ cartItem.dataset.id].price * quantity);
			calculateTotalPrice ( price )
			
			delete cartGoods[event.target.parentNode.parentNode.dataset.id]
		} )
	}
	
	function reRender ( item ) {
		
		document.querySelector( `[ data-id="${ item.id }" ]` ).querySelector( '.quantity' ).textContent = item.quantity;
	};
	
	let totalPrice = 0;
	
	function calculateTotalPrice ( price ) {
		
		totalPrice += price;
		document.querySelector( '.cart__total' ).textContent = 'Total ' + totalPrice;
		
	};
	
	
	

	
	
	getGoods ( url );
} );




