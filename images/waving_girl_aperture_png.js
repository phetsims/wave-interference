/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';

const image = new Image();
const unlock = simLauncher.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAADZCAYAAADovzj0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozRTNFMzM3OTU3RTIxMUU5ODY3NTlERjk5REVGQjcxMCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozRTNFMzM3QTU3RTIxMUU5ODY3NTlERjk5REVGQjcxMCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjNFM0UzMzc3NTdFMjExRTk4Njc1OURGOTlERUZCNzEwIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjNFM0UzMzc4NTdFMjExRTk4Njc1OURGOTlERUZCNzEwIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+KQQySgAACw5JREFUeNrsnQuU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';
export default image;