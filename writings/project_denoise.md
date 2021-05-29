---
title: "Project : Denoise"
date: "2021-05-27"
og:
  description: "Explanation of the second step of the project, which is denoising an image"
author:
  name: "Laurine Lafontaine"
---

<div style="width:30%"><img src="https://img.shields.io/static/v1?label=last-modified&message=27 may&color=orange"></div>
</br>

> Remember the [introduction](https://laurine-dev-blog.herokuapp.com/writings/steps) to my project ? One step is to denoise an image.

---

You can find my project on my Github : https://github.com/LafLaurine/imac3-personal-project

---

You'll find every file in the directory *denoise/*

## Paper I relied on

For the denoising part, I wanted to use a code that was implemented by researchers. I relied on [Plug-and-Play Image Restoration with Deep Denoiser Prior](https://arxiv.org/pdf/2008.13751.pdf) by Kai Zhang, Yawei Li, Wangmeng Zuo,Lei Zhang, Luc Van Gool and Radu Timofte, which is a paper that presents different type of image restoration as image denoising, deblurring, demosaicing and super-resolution. I only took the denoising part of their project.

Their source code can be found on this [Github project](https://github.com/cszn/DPIR).

After reading different papers, I thought that this approach was great, as they present different modules. The image denoising is used to these other modules.
This is a Gaussian denoiser and an upgrade of [FFDNet: Toward a Fast and Flexible Solution for CNN based Image Denoising](https://ieeexplore.ieee.org/abstract/document/8365806)

## Preprocessing data

My dataset is a clear one, so I didn't have any noisy images to test on.

As I wanted to have total control on my data, the first thing I did is applying noise to my dataset. As the model of denoising was trained with different data, it's no problem if I proceed that way. 

<div style="text-align:center">
<img src="../public\img\real_img.jpg"/></br>
<i>Example of cleared image from Flicker dataset</i>
</div>
</br>

You will find the preprocessing in the file `preprocess_images.py`.

It preprocessed every images contained in the folder `dataset/FlickerImages`, which is the directory where my dataset is stored.

```python
def mat2gray(img):
    A = np.double(img)
    out = np.zeros(A.shape, np.double)
    normalized = cv2.normalize(A, out, 1.0, 0.0, cv2.NORM_MINMAX)
    return out
 
#Add noise to the image
def random_noise(image, seed=None, clip=True, **kwargs):
    image = mat2gray(image)
    if image.min() < 0:
        low_clip = -1
    else:
        low_clip = 0
    if seed is not None:
        np.random.seed(seed=seed)
        
    noise = np.random.normal(kwargs['mean'], kwargs['var'] ** 0.5,
                                image.shape)        
    out = image  + noise
    if clip:        
        out = np.clip(out, low_clip, 1.0)
    return out 
  
for root, dirs, files in os.walk('../dataset/FlickerImages'):
    files.sort()
    for file in files[:500]:
        img = cv2.imread(root + "/" + file)
        noisy = random_noise(img, mean=0.1,var=0.01)
        noisy = np.uint8(noisy*255)
        cv2.imwrite("../dataset/FlickerNoisyImages/"+file,noisy)
```
As you can see with the snippet of code above, we apply a custom gaussian noise on the image.

<div style="text-align:center">
<img src="../public\img\noisy_img.jpg"/></br>
<i>Noisy version of the image</i>
</div>
</br>

## Denoising the image

<div style="text-align:center">
<img src="../public\img\denoised_img.jpg"/></br>
<i>Image denoised</i>
</div>
</br>

## Compare

There is two measures that are important when it comes to measuring the quality of image reconstruction : **Peak Signal To Noise Ratio (PSNR)** and **Structural Similarity (SSIM)**.

To compute the PSNR, we will use the formula below : 

```python
def calc_psnr(img1, img2):
    return 10. * torch.log10(1. / torch.mean((img1 - img2) ** 2))
``` 

Which corresponds well to the equation : 

$$
PSNR=10log_{10}(\frac{R^2}{{MSE}})
$$
where $R$ is the maximum fluctuation in the input image data type As the input image has a double-precision floating-point data type, R is 1. The MSE is the Mean Square Error.

Unlike PSNR, SSIM is based on visible structures in the image. For the computation, I use the function written in `skimage.metrics`, which is documented in [scikit-images.org](https://scikit-image.org/docs/dev/auto_examples/transform/plot_ssim.html) and is called with 

```python

structural_similarity((im1, im2,
                          win_size=None, gradient=False, data_range=None,
                          multichannel=False, gaussian_weights=False,
                          full=False, **kwargs):
```
where : 

- `im1` and `im2|  are images of the same shape.
- `win_size` : the side-length of the sliding window used in comparison. It must be and odd value.
- `gradient` : if True, also return the gradient with respect to im2.
- `data_range` :range of the input image (distance between minimum and maximum possible values). 
- `multichannel` : if True, treat the last dimension of the array as channels. 
- `gaussian_weights` : if True, each patch has its mean and variance spatially weighted by a normalized Gaussian kernel of width sigma=1.5.
- `full` : if True, also return the full structural similarity image.