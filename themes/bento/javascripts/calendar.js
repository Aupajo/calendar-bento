$(function() {
	$("#calendar").click(function() {
		if ($('#calendar').hasClass('active')) {
			return false
		}
		else {
			$("#calendar").addClass("active").attr("aria-selected", "true");
			if ($('#customise').hasClass('active')) {
				$("#customise").removeClass("active");
			}
			if ($('#connect').hasClass('active')) {
				$("#connect").removeClass("active").attr("aria-selected", "false");
			}
			$("#section-calendar").removeClass("hidden");
			$("#section-customise").addClass("hidden");
			$("#section-connect").addClass("hidden");
			$("#graph").removeClass("hidden");
		}
	});
	$("#customise").click(function() {
		if ($('#customise').hasClass('active')) {
			return false
		}
		else {
			$("#customise").addClass("active");
			if ($('#calendar').hasClass('active')) {
				$("#calendar").removeClass("active").attr("aria-selected", "false");
			}
			if ($('#connect').hasClass('active')) {
				$("#connect").removeClass("active").attr("aria-selected", "false");
			}
			$("#section-calendar").addClass("hidden");
			$("#section-customise").removeClass("hidden");
			$("#section-connect").addClass("hidden");
			$("#graph").addClass("hidden");
		}
	});
	$("#connect").click(function() {
		if ($('#connect').hasClass('active')) {
			return false
		}
		else {
			$("#connect").addClass("active").attr("aria-selected", "true");
			if ($('#calendar').hasClass('active')) {
				$("#calendar").removeClass("active").attr("aria-selected", "false");
			}
			if ($('#customise').hasClass('active')) {
				$("#customise").removeClass("active").attr("aria-selected", "false");
			}
			$("#section-calendar").addClass("hidden");
			$("#section-customise").addClass("hidden");
			$("#section-connect").removeClass("hidden");
			$("#graph").addClass("hidden");
		}
	});
	$("#one").change(function () {
		$(".design").find(':checkbox').prop("checked", this.checked);
	});
	$("#eleven").change(function () {
		$(".technology").find(':checkbox').prop("checked", this.checked);
	});
});
