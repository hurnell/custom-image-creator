<?php

namespace App\Imagine\Image;

use Imagine\Image\BoxInterface;
use Imagine\Image\PointInterface;

class Point implements PointInterface
{

    private $x;

    private $y;

    public function __construct($x, $y)
    {
        $this->x = $x;
        $this->y = $y;
    }

    public function getX()
    {
        return $this->x;
    }

    public function getY()
    {
        return $this->y;
    }

    public function in(BoxInterface $box)
    {
        return $this->x < $box->getWidth() && $this->y < $box->getHeight();
    }

    public function move($amount)
    {
        return new Point($this->x + $amount, $this->y + $amount);
    }

    public function __toString()
    {
        return sprintf('(%d, %d)', $this->x, $this->y);
    }
}