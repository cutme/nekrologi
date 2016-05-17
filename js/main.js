/*jshint expr:true */

function debouncer(func, timeout) {
	var timeoutID;
	timeout = timeout || 200;
	return function() {
		var scope = this,
			args = arguments;
		clearTimeout(timeoutID);
		timeoutID = setTimeout(function() {
			func.apply(scope, Array.prototype.slice.call(args));
		}, timeout);
	};
}
jQuery(function($) {
	function exist(o) {
		var d = ($(o).length > 0) ? true : false;
		return d;
	}
	function goToTarget(target) {
		var v = $('html, body'), o = $(target).offset().top, b = $('.c-bar').height();
		v.animate({
			scrollTop: o - b - 20
		}, {
			duration: 500
		});
	}
	function window_smaller_than(n) {
		var d = ($(window).width() < n) ? true : false;
		return d;
	}
	var L = {
		datepicker: function() {
			$('.js-datepicker').pickadate({
				format: 'yyyy-mm-dd',
				formatSubmit: 'yyyy-mm-dd',
				selectYears: true,
				selectMonths: true,
				selectYears: 100,
				max: true,
				monthsFull:["styczeń","luty","marzec","kwiecień","maj","czerwiec","lipiec","sierpień","wrzesień","październik","listopad","grudzień"],
				monthsShort:["sty","lut","mar","kwi","maj","cze","lip","sie","wrz","paź","lis","gru"],
				weekdaysFull:["niedziela","poniedziałek","wtorek","środa","czwartek","piątek","sobota"],
				weekdaysShort:["niedz.","pn.","wt.","śr.","cz.","pt.","sob."],
				today:"Dzisiaj",
				clear:"Usuń",
				close:"Zamknij"
			});			
		},
		tabs: function() {
			var el = $('.js-tabs');

			function showTab(i, w) {
				$('.o-tabs__nav .is-active', w).removeClass('is-active');
				$('.o-tabs__nav li', w).eq(i).addClass('is-active');
				$('.o-tabs__content .o-tabs__item', w).removeClass('is-active animated fadeIn');

				function show(i) {
					$('.o-tabs__content .o-tabs__item', w).eq(i).addClass('is-active animated fadeIn');
				}
				switch (i) {
				case 0:
					show(0);
					break;
				case 1:
					show(1);
					break;
				case 2:
					show(0);
					show(1);
					break;
				}
			}
			el.each(function() {
				var n = $('> .o-tabs__nav', this),
					t = $('> ul > li', n),
					i = n.find('.is-active').index(),
					_t = $(this);
				t.click(function(e) {
					e.preventDefault();
					var i = $(this).index();
					showTab(i, _t);
				});
				i >= 0 && showTab(i, _t);
			});
		},
		upload: function() {
			var e = $('.c-upload'),
				b = $('.c-upload__input', e),
				d = b.text();
			$('.c-upload').on('change', '#file', function() {
				var n = $('#file').val().replace(/.*(\/|\\)/, '');
				if (n) {
					b.text(n);
					e.addClass('file-added');
				} else {
					b.text(d);
					e.removeClass('file-added');
				}
			});
		},
		validate: function() {
			var el = $('form'),
				error = 0,
				errorClass = 'has-error',
				check, editorContent,
				reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

			function checkField(o) {				
				if ($(o).val() == '') {
				
					if ($(o).attr('type') == 'file') {
						$(o).parents('.js-upload').addClass(errorClass);	
					} else {
						$(o).parent().addClass(errorClass);
					}
					return false;
				}
				return true;
			}
			var validateStart = function(o) {
				error = 0;
				el.find('.has-error').removeClass(errorClass);
				$('[type=text], [type=tel], [type=password], [type=date], [type=file]', o).each(function() {
					if ( $(this).prop('required') === true ) {
						check = checkField(this);
						if (check === false) {
							error = 1;
						}
					}
				});
				$('textarea', o).each(function() {
					if ( $(this).prop('required') === true ) {
					
						if ( $(this).parents('.o-form__fields').find('iframe').contents().find("body").text() == '' ) {
							$(this).parent().addClass(errorClass);
							error = 1;
						}
/*
editorContent = tinyMCE.get('tinyeditor').getContent();
						if (editorContent == '') {
							error = 1;
						}
*/
					}
				});
				
				
				
				$('[type=email], [type=text], [type=password]', o).on('keydown', function() {
					$(this).parent().removeClass(errorClass);
				});
				$('[type=email]', o).each(function() {
					if ($(this).prop('required')) {
						var email = $(this).val();
						if (email === '') {
							$(this).parent().addClass(errorClass);
							error = 1;
						} else if (reg.test(email) === false) {
							$(this).parent().addClass(errorClass);
							error = 1;
						} else {
							$(this).parent().removeClass(errorClass);
						}
					}
				});
				$('[type=checkbox]', o).each(function() {
					if ($(this).prop('required')) {
						if (!$(this).prop('checked')) {
							$(this).parent().addClass(errorClass);
							error = 1;
						} else {
							$(this).parent().removeClass(errorClass);
						}
					}
				});
				return error;
			};
			el.each(function() {
				var submit = $('.submit', this),
					is_error, _t = $(this);
				$('input, select', this).each(function() {
					if ($(this).prop('required')) {
						$(this).prev('.o-form__lead').append(' <i class="o-form__required">*</i>');
					}
				});
				submit.on('click', function(e) {
					e.preventDefault();
					is_error = validateStart(_t);
					if (is_error === 1) {
						goToTarget(_t);
					} else {
						_t.submit();
						return true;
					}
				});
			});
		},
		init: function() {
			exist('form') && L.validate();
			exist('.js-datepicker') && L.datepicker();
			exist('.js-tabs') && L.tabs();
			exist('.js-upload') && L.upload();
		}
	};
	var N = {
		mobileNav: function() {
			function shTrigger() {
				var t = $('.c-nav-trigger'),
					n = $('.c-nav--top'),
					status = false;

				function init() {
					n.removeClass('u-pos-y').addClass('is-mobile');
					status = true;
				}
				t.on('click', function(e) {
					e.preventDefault();
					$(this).toggleClass('is-active');
					n.slideToggle();
				});
				$(window).resize(debouncer(function(e) {
					if (window_smaller_than(769)) {
						if (status === false) {
							init();
						}
					} else {
						if (status === true) {
							t.removeClass('is-active');
							n.addClass('u-pos-y').removeClass('is-mobile').attr('style', '');
							status = false;
						}
					}
				}));
				if (window_smaller_than(769)) {
					init();
				}
			}
			shTrigger();
		},
		init: function() {
			N.mobileNav();
		}
	};
	$(document).ready(function() {
		L.init();
		N.init();
	});
});