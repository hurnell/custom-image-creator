<?php

namespace App\Imagine\Filter\Loader;

use App\Imagine\Image\Point;
use Imagine\Filter\Basic\Crop;
use Imagine\Image\Box;
use Imagine\Image\ImageInterface;
use Liip\ImagineBundle\Imagine\Filter\Loader\LoaderInterface;

class CustomCropFilter implements LoaderInterface
{
    /**
     * @param ImageInterface $image
     * @param array $options
     * @return Crop|ImageInterface
     */
    public function load(ImageInterface $image, array $options = [])
    {
        $x = $options['start'][0] ?? null;
        $y = $options['start'][1] ?? null;
        $width = $options['size'][0] ?? null;
        $height = $options['size'][1] ?? null;

        $filter = new Crop(new Point($x, $y), new Box($width, $height));
        $image = $filter->apply($image);
        return $image;
    }
}