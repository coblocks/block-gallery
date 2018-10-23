/**
 * External dependencies
 */
import map from 'lodash/map';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const { ButtonGroup, Button } = wp.components;

class SizeControl extends Component {

	constructor( props ) {
		super( ...arguments );
		this.getSizes = this.getSizes.bind( this );
	}

	componentDidUpdate( prevProps ) {

		const { align, gridSize } = this.props.attributes;

		// Prevent small and medium column grid sizes without wide or full alignments.
		if ( align == undefined ) {
			if ( columns == 'med' || columns == 'sml' ) {
				this.props.setAttributes( {
					gridSize: 'xlrg',
				} );
			}
		}
	}

	getSizes() {
		const { type } = this.props;
		const { align } = this.props.attributes;

		const defaultSizes = [
			{
				shortName: 'None',
				size: 'none',
			},
			{
				shortName: 'S',
				size: 'sml',
			},
			{
				shortName: 'M',
				size: 'med',
			},
			{
				shortName: 'L',
				size: 'lrg',
			},
		];

		const standardSizes = [
			{
				shortName: 'wide' == align || 'full' == align ? 'L' : __( 'Large' ),
				size: 'lrg',
			},
			{
				shortName: 'wide' == align || 'full' == align ? 'XL' : __( 'Extra Large' ),
				size: 'xlrg',
			},
		];

		const wideSizes = [
			{
				shortName: 'M',
				size: 'med',
			},
		];

		const fullSizes = [
			{
				shortName: 'S',
				size: 'sml',
			},
		];

		// If this is a standard size settings, not a complex grid sizer.
		if ( 'smlx' == type ) {

			const standardSizes = [
				{
					shortName: 'S',
					size: 'sml',
				},
				{
					shortName: 'M',
					size: 'med',
				},
				{
					shortName: 'L',
					size: 'lrg',
				},
				{
					shortName: 'XL',
					size: 'xlrg',
				},
			];

			return standardSizes;
		}

		// If this is a standard size settings, not a complex grid sizer.
		if ( 'reverse-grid' == type ) {

			const standardSizes = [
				{
					shortName: 'wide' == align || 'full' == align ? 'S' : __( 'Small' ),
					size: 'sml',
				},
				{
					shortName: 'wide' == align || 'full' == align ? 'M' : __( 'Medium' ),
					size: 'med',
				},
			];

			const wideSizes = [
				{
					shortName: 'L',
					size: 'lrg',
				},
			];

			const fullSizes = [
				{
					shortName: 'XL',
					size: 'xlrg',
				},
			];

			if ( 'wide' == align ) {
				return standardSizes.concat( wideSizes );
			} else if ( 'full' == align ) {
				return standardSizes.concat( wideSizes ).concat( fullSizes );
			} else {
				return standardSizes;
			}
		}

		// If this is a standard size settings, not a complex grid sizer.
		if ( 'grid' != type ) {
			return defaultSizes;
		}

		if ( 'wide' == align ) {
			return wideSizes.concat( standardSizes );
		} else if ( 'full' == align ) {
			return fullSizes.concat( wideSizes ).concat( standardSizes );
		} else {
			return standardSizes;
		}
	}

	render() {

		const {
			onChange,
			value,
			resetValue = undefined,
			label,
			reset = true,
		} = this.props;

		return (
			<Fragment>
				{ label && <p className="components-blockgallery-inspector__size-control--label">{ label }</p> }
				<div className="components-blockgallery-inspector__size-control">
					<ButtonGroup aria-label={ __( 'Select Size' ) }>
						{ map( this.getSizes(), ( { size, shortName } ) => (
							<Button
								key={ size }
								isLarge
								isPrimary={ value === size }
								aria-pressed={ value === size }
								onClick={ () => onChange( size ) }
							>
								{ shortName }
							</Button>
						) ) }
					</ButtonGroup>
					{ reset &&
						<Button
							isLarge
							onClick={ () => onChange( resetValue ) }
						>
							{ __( 'Reset' ) }
						</Button>
					}
				</div>
			</Fragment>
		);
	}
}

export default SizeControl;