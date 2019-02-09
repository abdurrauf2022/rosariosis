/**
 * PasswordStrength jQuery plugin
 *
 * Indicate password strength to user based on the zxcvbn JS library results.
 * Also adds reveal / hide password routine to input.
 *
 * @example passwordStrength( '#password', 3 );
 *
 * @link https://francoisjacquet.gitlab.io/password-strength-zxcvbn-js
 *
 * @package RosarioSIS
 * @subpackage assets/js
 * @since 4.4
 */

$.fn.passwordStrength = function(minStrength) {

	var $password = this;

	/**
	 * Check Password strength
	 * Using 5 colored bars corresponding to score points.
	 *
	 * @uses zxcvbn JS library.
	 *
	 * @return {bool} Minimum score <= password score.
	 */
	var checkPassword = function() {
		var password = $password.val(),
			score = 0;

		// console.log(password, minStrength);

		var result = zxcvbn(password),
			score = result.score;

		// console.log(result);

		$password.nextAll('.password-strength-bars').children('span').each(function(i, el) {
			// console.log(i, el);

			var cssVisibility = (password !== '' &&
				i <= score ? 'visible' : 'hidden');

			$(el).css('visibility', cssVisibility);
		});

		return (minStrength <= score);
	};


	var submitCheck = function(e) {

		if (!checkPassword()) {
			e.preventDefault();

			// Check Password failed (min score > score), do not send form.
			$password.focus();
			$password[0].setCustomValidity('Password must be stronger.');
		} else {
			$password[0].setCustomValidity('');
		}
	};

	/**
	 * Toggle password
	 * Reveal / hide password input
	 */
	var togglePassword = function() {
		// console.log(this.id);

		$password[0].type = ($(this).hasClass('password-show') ? 'text' : 'password');

		$password.nextAll('.password-toggle').toggle();
	};

	var zxcvbnInit = function() {

		if (!minStrength) {
			return;
		}

		// zxcvbn.js is loaded.
		$password.keyup(checkPassword);

		$($password[0].form).submit(submitCheck);
	};

	/**
	 * 1. Call zxcvbn on password input keyup.
	 * 2. Prevent submitting form if minimum required score < user password score.
	 * 3. Toggle password text visibility on icon click.
	 */
	var init = function() {
		if (!$password.length) {
			return;
		}

		if (minStrength > 0 && typeof zxcvbn == 'undefined') {
			$.getScript('assets/js/zxcvbn/zxcvbn.js', function() {
				zxcvbnInit();
			});
		} else {
			zxcvbnInit();
		}

		$password.nextAll('.password-toggle').bind('click', togglePassword);

		return $password;
	};

	init();
}
