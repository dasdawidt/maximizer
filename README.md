# Maximizer

> *Maximize anything! - Your screen is the limit.*

Get it on the [Chrome Web Store](https://chromewebstore.google.com/detail/maximizer/lmjgdlmpphlpkcbabphldnpicijfdpeb)!

## Contents

1. [Usage](#usage)
1. [Limitations](#limitations)
1. [Planned Features](#planned-features)
1. [Changelog](#changelog)
1. [License](#license)

## Usage

1. Visit a website you like
2. Find some content of it that's worth maximizing
3. Right click the content to open the context menu
4. Press "Maximize something..."
5. Select the specific element you want to maximize
6. Enjoy the desired content in full width and height!

## Limitations

- Since the user visibly selects the element to maximize, only visible elements can be maximized.
  This can lead too errors when content is wrapped inside a container that isn't visible.
  In result, you may encounter situatios where it's a bit fiddly to select the exact element you want to maximize.
- When a website utilizes iframe elements, the selection is only available inside the iframe in which the context menu option of Maximizer has been triggered.
  This originates in security limitations that browsers implement and cannot to my knowledge cannot be overcome.
- If a element is clicked to be maximized, which the website itself responds to when clicked, the maximization might be interrupted

## Planned Features

- Control for background of maximized element
- Scrolling for maximized element

## Changelog

### 0.2.1

- Add popup that explaines how to maximize/abort the maximization process.

### 0.2.0

- Revert changes from version 0.0.2 because they broke iframe support.
  For now this is the only way to support them.
  Looking for a way without host permission.

### 0.1.1

- Improve German translation.

### 0.1.0

- Add internationalization.
  Now supporting English, German and Spanish.

### 0.0.3

- Dynamically add/remove event listeners to/from document instead of using boolean flag.
  This should make the extension more performant.

### 0.0.2

- Use the `activeTab` and `scripting` permissions instead of `contentScripts`.
  This way, the extension only has access to the page if the context menu item is clicked.

### 0.0.1

- Create the ability to select any visible element of a website and make it fill your whole screen

## License

No license is provided.

Since this is a public repository, you may however view and fork the code according to GitHub's [Terms of Service](https://help.github.com/articles/github-terms-of-service).
Permission for usage that exceeds those terms is not granted.

> Copyright (c) 2023 David Maier
>
> All rights reserved.
>
> THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
