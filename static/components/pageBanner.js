"use strict";

const template = document.getElementById("page-banner").content;

class PageBanner extends HTMLElement
{
	constructor()
	{
		super();
		this.attachShadow({ mode: "open" });
		this.shadowRoot.appendChild(template.cloneNode(true));
	}

	connectedCallback()
	{
		console.log("ready");
	}
}

customElements.define("page-banner", PageBanner);
