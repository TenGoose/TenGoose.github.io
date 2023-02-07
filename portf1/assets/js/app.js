$(function () {
	let header = $("#header"),
		introH = $("#intro").innerHeight(),
		scrollOffset = $(window).scrollTop();

	/* Fixed header */
	checkScroll(scrollOffset);

	$(window).on("scroll", function () {
		scrollOffset = $(this).scrollTop();

		checkScroll(scrollOffset);
	});

	function checkScroll() {
		if (scrollOffset >= introH) {
			header.addClass("fixed");
		} else {
			header.removeClass("fixed");
		}
	}

	/* Smooth scroll */
	$("[data-scroll]").on("click", function (event) {
		event.preventDefault();

		let $this = $(this),
			blockId = $(this).data("scroll"),
			blockOffset = $(blockId).offset().top;

		$("#nav a").removeClass("active");
		$this.addClass("active");

		$("html, body").animate(
			{
				scrollTop: blockOffset,
			},
			500
		);
	});

	/* Menu nav toggle*/
	$("#nav_toggle").on("click", function (event) {
		event.preventDefault();

		$(this).toggleClass("active");
		$("#nav").toggleClass("active");
	});

	/* Collapse */
	$("[data-collapse]").on("click", function (event) {
		event.preventDefault();

		let $this = $(this),
			blockId = $(this).data("collapse");

		$this.toggleClass("active");
	});

	/* Slider */
	$("[data-slider]").slick({
		Infinity: true,
		fade: false,
		slidesToShow: 1,
		slidesToScroll: 1,
	});
});
