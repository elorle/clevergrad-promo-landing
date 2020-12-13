document.addEventListener("DOMContentLoaded", ready);

function ready() {
	var form = document.getElementsByTagName('form')[0];
	form.onsubmit = submitForm.bind(form);

	var phone = document.getElementById('phone');
	phone.addEventListener("input", mask, false);
    phone.addEventListener("focus", mask, false);
    phone.addEventListener("blur", mask, false);
    phone.addEventListener("keydown", mask, false);
}

function submitForm() {
	var inputs = this.getElementsByTagName('input');
	var name,phone,allow;
	name = inputs[0].value;
	phone = inputs[1].value;
	allow = inputs[2];
	if (name == '') {
		alert('Пожалуйста, представьтесь!');
		return false;
	}
	if (phone == '') {
		alert('Пожалуйста, введите номер телефона!');
		return false;
	}
	if (!allow.checked) {
		alert('Пожалуйста, согласитесь на обработку данных. Обещаем, Ваши данные НЕ будут переданы третьим лицам!');
		return false;
	}
	var xhr = new XMLHttpRequest();

	var body = 'name=' + encodeURIComponent(name) + '&phone=' + encodeURIComponent(phone);

	xhr.open("POST", 'https://gorodam.net/instaform/mail.php', true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

	xhr.send(body);

	xhr.onload = function() {
		if (xhr.responseText == 'success') {
			success(this);
		}
		else {
			console.log(xhr.responseText);
			failure(this);
		}
	}.bind(this);
	return false;
}

function success(formBlock) {
	var resBlock = document.getElementById('result');
	var sucBlock = document.getElementById('success');
	formBlock.style.display = 'none';
	resBlock.style.display = 'block';
	sucBlock.style.display = 'block';
}

function failure(formBlock) {
	var resBlock = document.getElementById('result');
	var failBlock = document.getElementById('failure');
	formBlock.style.display = 'none';
	resBlock.style.display = 'block';
	failBlock.style.display = 'block';
}

function mask(event) {
	if (event.keyCode) {
		keyCode = event.keyCode;
	}
	var pos = this.selectionStart;
	if (pos < 3) event.preventDefault();
	var matrix = "+7 (___) ___-__-__",
		i = 0,
		def = matrix.replace(/\D/g, ""),
		val = this.value.replace(/\D/g, ""),
		new_value = matrix.replace(/[_\d]/g, function(a) {
			return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
		});
	i = new_value.indexOf("_");
	if (i != -1) {
		if (i < 5) {
			i = 3;
		}
		new_value = new_value.slice(0, i);
	}
	var reg = matrix.substr(0, this.value.length).replace(/_+/g,
		function(a) {
			return "\\d{1," + a.length + "}";
		}).replace(/[+()]/g, "\\$&");
	reg = new RegExp("^" + reg + "$");
	if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
	if (event.type == "blur" && this.value.length < 5)  this.value = "";
}