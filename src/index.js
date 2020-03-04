import './scss/main.scss';

document.addEventListener( 'DOMContentLoaded', () => {

	//let url = 'https://my-json-server.typicode.com/Disasster27/db/db';
	let url = 'https://api.myjson.com/bins/cyod6';
	let amountElements = 15;
	let pages = 0;
	let product = [];
	const cartGoods = {};
	let totalAmount = 0;
	let totalPrice = 0;
	
	// console.log( cartGoods )
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
				toArr ( data );
			} );
	};
	
	function getPriceRange ( data, AllElem ) {
		
		minimalPrice = data[ 1 ].price;
		let keysArr = Object.keys(data)
		// console.log( Object.keys(data) )
		

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
						<div class="item__add" data-item-id="${ product.id }">
							<a href="#" class="add"><img src="img/Forma%201%20copy.svg" alt="">Add to Cart</a>
						</div>`;
		showItem( item );
		addToCartEvent( product );
	};

	

	function countPages ( allGoods ) {
		// console.log( allGoods )
		const allElem = Object.keys( allGoods ).length;
		pages = Math.ceil( allElem/amountElements );
		setPagination ();
		getPriceRange( allGoods, allElem );
		addPaginationEvent( allGoods );
	};
	
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

	function addPaginationEvent( allGoods ) {
		
		document.querySelectorAll( '[data-page-number]' ).forEach( elem => {
			elem.addEventListener( 'click', event => {
				let start = amountElements * (elem.dataset.pageNumber - 1 );
				let end = amountElements * elem.dataset.pageNumber ;
				// console.log(  start, end  )
				let arr = toArr ( allGoods ).slice( start, end )
				// console.log( arr )
				reRenderItem ( arr );
			} );
		} );
	};

	function renderCatalog ( goods ) {
		for ( let i = 1 ; i <= amountElements ; i++ ) {
			renderItem ( goods[ i ] )
		}
	};	

	function reRenderItem ( arr ) {
		document.querySelectorAll( '.item' ).forEach( elem => {
			elem.remove();
		} )
		for ( let i = 0 ; i < arr.length ; i++ ) {
			renderItem ( arr[ i ] );
		}
	};

	function toArr ( goods ) {
		const goodsArray = [];
		for ( let key in goods ) {
			goodsArray.push( goods[key] );
		};
		product = goodsArray ;
		// console.log( product )
		return goodsArray;
	};
	
	function addToCartEvent ( product ) {
//		console.log( product )
		
		document.querySelector( `[ data-item-id="${ product.id }" ]` ).addEventListener( 'click', event => {
			if ( cartGoods.hasOwnProperty( product.id ) ) {
				cartGoods[ product.id ].quantity += 1; 
				reRender( cartGoods[product.id] );
				
			} else {
				let { id, title, price, image } = product;
				cartGoods[ product.id ] = { id, title, price, image };
				cartGoods[ product.id ].quantity = 1;
				renderCart( cartGoods[product.id] );
				// console.log(product)
				
			};
			totalAmount += 1;
			setTotalAmount ();
			calculateTotalPrice ( product.price );
			storage.save ( );
			// console.log( cartGoods )
		} );
	};
	
	function setTotalAmount () {
		document.querySelector( '.cart__quantity' ).textContent = totalAmount;
	}

	function renderCart ( item ) {
		// console.log(item)
		// const cart = document.querySelector( '.cart__list' );	
		const cartTotal = document.querySelector( '.cart__total' );	
		const cartItem = document.createElement( 'div' );
		cartItem.classList.add( 'cart__item' );
		cartItem.setAttribute( 'data-cart-id', `${ item.id }` )
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
		// console.log( cartItem )
		const deleteBtn = cartItem.querySelector( '.cart__delete' );
		
		deleteBtn.addEventListener( 'click', event => {
			// console.log( cartGoods )
			let quantity = cartGoods[ cartItem.dataset.cartId].quantity;
			// console.log( cartItem.dataset )
			cartItem.remove();
			totalAmount -= quantity;
			setTotalAmount ();
			let price = -(cartGoods[ cartItem.dataset.cartId].price * quantity);
			calculateTotalPrice ( price );
			
			delete cartGoods[event.target.parentNode.parentNode.dataset.cartId];
			storage.save();
		} );
	};
	
	function reRender ( item ) {
		// console.log( item )
		document.querySelector( `[ data-cart-id="${ item.id }" ]` ).querySelector( '.quantity' ).textContent = item.quantity;
	};
	
	function calculateTotalPrice ( price ) {
		totalPrice += price;
		setTotalPrice ();
	};
	function setTotalPrice () {
		document.querySelector( '.cart__total' ).textContent = 'Total ' + totalPrice;
	};
	
	function sort () {
		let input = document.querySelector( '.filter__input' );
		let suitableElem =[];

		document.querySelector( '.filter__text' ).addEventListener( 'submit', event => {
			event.preventDefault();
			let inputValue = input.value.trim();
			const regex = new RegExp( inputValue, 'i' );
			
			suitableElem = product.filter( elem =>  regex.test( elem.title ) );

			reRenderItem ( suitableElem )
			console.log( suitableElem )
		}  );
	};

	function showItem ( item ) {
		item.addEventListener( 'click', event => {

			if ( !event.target.classList.contains( 'add' ) ) {
				createListing();
				
			};
			
		} );
	};

	function createListing () {

		

		console.log( 'ee' );
	}

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




