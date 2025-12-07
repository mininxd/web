// src/utils/dom.js
export class DOMUtils {
  static getElement(selector) {
    return document.querySelector(selector);
  }

  static getAllElements(selector) {
    return document.querySelectorAll(selector);
  }

  static createElement(tag, className = '', html = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (html) element.innerHTML = html;
    return element;
  }

  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}