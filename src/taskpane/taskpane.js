/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

// images references in the manifest
import "../../assets/icon-16.png";
import "../../assets/icon-32.png";
import "../../assets/icon-80.png";

/* global document, Office */

let intervalRef;
const apiBaseUrl = "http://localhost:8080"
http://localhost:8080/outlook/checkUserLoggedIn?email=rohit@rampwin.com

Office.onReady(async (info) => {
	if (info.host === Office.HostType.Outlook) {
		document.getElementById("sideload-msg").style.display = "none";
		document.getElementById("app-body").style.display = "flex";
		document.getElementById("register").onclick = register;
		document.getElementById("reset").onclick=reset;
		document.getElementById("getsnippets").onclick = getSnippets;
		document.getElementById("rephrase").onclick = rephrase;
		document.getElementById("insert").onclick = insert;
		document.getElementById("send").onclick = send
		checkUserLoggedIn().then(() => {
			console.log("Loggin done")
		}).catch(() => {
			console.log("login failed")
		})
	}
});

function reset(){
	document.getElementById('choosesnippets').value="";
}
export async function getSnippets() {
	let userid = document.getElementById('getsnippets').getAttribute("data-userid")
	
	console.log("i am in get snippets");
	var xhr = new XMLHttpRequest();
	xhr.open("GET", `${apiBaseUrl}/outlook/getSnippets?id=${userid}`);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onload = () => {
		if (xhr.status == 200) {
			let res = JSON.parse(xhr.responseText)
			console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
			let data = res.data;
			console.log(data)
			var str = ''
			data.forEach((d) => {
				console.log(d.key)
				console.log(d.value)
				str += '<option value="' + d.key + '" data-value="' + d.value + '" />';
				document.getElementById('snippets').innerHTML = str
			})
		}
		else {
			console.log("i am in error")
			console.log(xhr.statusText);
		}
		document.getElementById('message').innerHTML = ''
	};
	xhr.send(null)
	document.getElementById('message').innerHTML = 'LOADING'
	document.getElementById('heading').innerHTML = 'Get Snippets!'
	document.getElementById('getsnippets').style.display = 'none'
	document.getElementById('rephrase').style.display = 'none'
	document.getElementById('choosesnippets').style.display = 'block'
	document.getElementById('insert').style.display = 'block'
	document.getElementById('reset').style.display='block'

}
export async function rephrase() {
	document.getElementById('heading').innerHTML = 'Enter your sentence here'
	document.getElementById('getsnippets').style.display = 'none'
	document.getElementById('rephrase').style.display = 'none'
	document.getElementById('textbox').style.display = 'block';
	document.getElementById('send').style.display = 'block';
}
export async function register() {
	console.log("i am in register")
	let url = document.getElementById('register').getAttribute("data-authurl")
	let windowRef = openRequestedPopup(url);
	if (!intervalRef) {
		intervalRef = setInterval(() => {
			checkUserLoggedIn().then((isLoggedIn) => {
				if (isLoggedIn) {
					clearInterval(intervalRef)
					if (!windowRef.closed) {
						console.log("Window closed")
						windowRef.close()
					}	
				}
			}).catch(() => {
				console.log("login failed, checking again")
			})
		}, 2000);	
	}
}

export async function insert() {
	let item = Office.context.mailbox.item;
	console.log("insert")
	let shownval = document.getElementById("choosesnippets").value;
	let text = document.querySelector("#snippets option[value='" + shownval + "']").dataset.value;
	console.log(text)

	item.body.getTypeAsync(
		function (result) {
			if (result.status == Office.AsyncResultStatus.Failed) {
				write(result.error.message);
			} else {
				// Successfully got the type of item body.
				// Set data of the appropriate type in body.
				if (result.value == Office.MailboxEnums.BodyType.Html) {
					// Body is of HTML type.
					// Specify HTML in the coercionType parameter
					// of setSelectedDataAsync.
					item.body.setSelectedDataAsync(
						text,
						{
							coercionType: Office.CoercionType.Html,
							asyncContext: { var3: 1, var4: 2 }
						},
						function (asyncResult) {
							if (asyncResult.status ==
								Office.AsyncResultStatus.Failed) {
								write(asyncResult.error.message);
							}
							else {
								// Successfully set data in item body.
								// Do whatever appropriate for your scenario,
								// using the arguments var3 and var4 as applicable.
							}
						});
				} else {
					// Body is of text type. 
					item.body.setSelectedDataAsync(
						text,
						{
							coercionType: Office.CoercionType.Text,
							asyncContext: { var3: 1, var4: 2 }
						},
						function (asyncResult) {
							if (asyncResult.status ==
								Office.AsyncResultStatus.Failed) {
								write(asyncResult.error.message);
							}
							else {
								// Successfully set data in item body.
								// Do whatever appropriate for your scenario,
								// using the arguments var3 and var4 as applicable.
							}
						}
					);
				}
			}
		});
}

export function openRequestedPopup(url) {
	let windowRef = window.open(url, "Auth Pragma", 'width=500, height=400')
	console.log("redirect-----", url)
	return windowRef
}

export function credentialMatch() {
	console.log("I am in credential Match");
	document.getElementById('run').style.display = 'none'
	document.getElementById('heading').innerHTML = 'Please choose any function you want to be done!'
	document.getElementById('getsnippets').style.display = 'block'
	document.getElementById('rephrase').style.display = 'block'

}

export function checkUserLoggedIn() {
	return new Promise((resolve, reject) => {
		/**
		 * Insert your Outlook code here
		 */
		console.log("runnnnnnnnnnn")
		let email = Office.context.mailbox.userProfile.emailAddress;
		let xhr = new XMLHttpRequest();
		xhr.open("GET", `${apiBaseUrl}/outlook/checkUserLoggedIn?email=${email}`);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.onload = () => {
			if (xhr.status == 200) {
				let res = JSON.parse(xhr.responseText)
				console.log("response-->", res.status)
				if (res.status == "ok") {
					document.getElementById('register').style.display = 'none'
					document.getElementById('run').style.display = 'none'
					document.getElementById('heading').innerHTML = 'Please choose any function you want to be done!'
					document.getElementById('getsnippets').style.display = 'block'
					document.getElementById('rephrase').style.display = 'block'
					document.getElementById('getsnippets').setAttribute("data-userid", res.userid)
					document.getElementById('rephrase').setAttribute("data-userid", res.userid)
					resolve(true)
				} else if (res.status == "failed") {
					document.getElementById('run').style.display = 'none'
					document.getElementById('heading').innerHTML = `Please register yourself on clicking button`
					document.getElementById('register').style.display = 'block'
					document.getElementById('register').setAttribute("data-authurl", res.authorization_url)
					resolve(false)
				}
			} else {
				console.log("text-->", xhr.statusText);
				reject()
			}
		};
		xhr.send(null)
		console.log("end")
	})
}
