export default function directive(app) {
	app.directive('btn', {
		mounted(el, binding) {
			const baseStyle = {};
			const { value } = binding;
			switch (value) {
				case 'max':
					el.style.width = '140px';
					break;

				default:
					break;
			}
		},
	});
}
