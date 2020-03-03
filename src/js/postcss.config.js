module.exports = {
  plugins: [
    require( 'autoprefixer' ),
	require( 'css-mqpacker' ), //компанует медиазапросы
	require( 'cssnano' ) ( {
		preset : [
			'default', {
				discardComments : {
					removeAll : true,
				}
			}
		]
	} )
  ]
}