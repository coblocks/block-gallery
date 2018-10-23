/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import './styles/style.scss';
import './styles/editor.scss';
import Edit from './components/edit';
import icons from './../../utils/icons';
import { BackgroundStyles } from '../../components/background/';
import { GlobalAttributes, GlobalTransforms, GlobalClasses, GlobalStyles } from '../../components/global/';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { registerBlockType, createBlock } = wp.blocks;
const { RichText } = wp.editor;

/**
 * Block constants.
 */
const blockName = __( 'Stacked' );

const blockIcon = icons.stacked;

const blockKeywords = [
	__( 'gallery' ),
	__( 'images' ),
	__( 'photos' ),
];

const blockAttributes = {
	...GlobalAttributes,

	// Block specific attributes.
	fullwidth: {
		type: 'boolean',
	},
	captionStyle: {
		type: 'string',
	},
};

/**
 * Block registration
 */
registerBlockType( 'blockgallery/stacked', {

	title: blockName,

	description: __( 'Display multiple images in an single column stacked gallery.' ),

	icon: {
		src: blockIcon,
	},

	category: 'block-gallery',

	keywords: blockKeywords,

	attributes: blockAttributes,

	supports: {
		align: [ 'wide', 'full' ],
	},

	transforms: {
		from: [
			{
				type: 'block',
				blocks: [ 'blockgallery/masonry' ],
				transform: ( attributes ) => (
					createBlock( 'blockgallery/stacked', {
						...GlobalTransforms( attributes ),
					} )
				),
			},
			{
				type: 'block',
				blocks: [ 'blockgallery/carousel' ],
				transform: ( attributes ) => (
					createBlock( 'blockgallery/stacked', {
						...GlobalTransforms( attributes ),
					} )
				),
			},
			{
				type: 'block',
				blocks: [ 'blockgallery/thumbnails' ],
				transform: ( attributes ) => (
					createBlock( 'blockgallery/stacked', {
						...GlobalTransforms( attributes ),
					} )
				),
			},
			{
				type: 'block',
				blocks: [ 'blockgallery/offset' ],
				transform: ( attributes ) => (
					createBlock( 'blockgallery/stacked', {
						...GlobalTransforms( attributes ),
					} )
				),
			},
			{
				type: 'block',
				blocks: [ 'blockgallery/auto-height' ],
				transform: ( attributes ) => (
					createBlock( 'blockgallery/stacked', {
						...GlobalTransforms( attributes ),
					} )
				),
			},
			{
				type: 'block',
				blocks: [ 'core/gallery' ],
				transform: ( attributes ) => (
					createBlock( 'blockgallery/stacked', {
						...GlobalTransforms( attributes ),
					} )
				),
			},
		],
		to: [
			{
				type: 'block',
				blocks: [ 'core/gallery' ],
				transform: ( attributes ) => (
					createBlock( 'core/gallery', {
						...GlobalTransforms( attributes ),
					} )
				),
			},
		],
	},

	edit: Edit,

	save( { attributes } ) {

		const {
			captionColor,
			customCaptionColor,
			fullwidth,
			gutter,
			gutterMobile,
			images,
			linkTo,
			shadow,
		} = attributes;

		const ulClasses = classnames(
			...GlobalClasses( attributes ), {
				'has-fullwidth-images': fullwidth,
				[ `has-margin` ] : gutter > 0,
			}
		);

		const ulStyles = {
			...GlobalStyles( attributes ),
			...BackgroundStyles( attributes ),
		};

		const figureClasses = classnames(
			'blockgallery--figure', {
				[ `has-margin-bottom-${ gutter }` ] : gutter > 0,
				[ `has-margin-bottom-mobile-${ gutterMobile }` ] : gutterMobile > 0,
		} );

		return (
			<ul className={ ulClasses } style={ ulStyles }>
				{ images.map( ( image ) => {
					let href;

					switch ( linkTo ) {
						case 'media':
							href = image.url;
							break;
						case 'attachment':
							href = image.link;
							break;
					}

					const imgClasses = classnames(
						image.id ? [ `wp-image-${ image.id }` ] : null, {
							[ `has-shadow-${ shadow }` ] : shadow != 'none',
					} );

					const img = <img src={ image.url } alt={ image.alt } data-id={ image.id } data-link={ image.link } className={ imgClasses } />;

					return (
						<li key={ image.id || image.url } className="blockgallery--item">
							<figure className={ figureClasses }>
								{ href ? <a href={ href }>{ img }</a> : img }
								{ image.caption && image.caption.length > 0 && (
									<RichText.Content tagName="figcaption" className="blockgallery--caption" value={ image.caption } />
								) }
							</figure>
						</li>
					);
				} ) }
			</ul>
		);
	},
} );

export { blockName, blockIcon };
