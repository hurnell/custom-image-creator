<?php
/**
 * Created by PhpStorm.
 * User: nigel
 * Date: 27/03/2019
 * Time: 10:06
 */

namespace App\Form\Type;


use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Validator\Constraints\Image;
use Symfony\Component\Validator\Constraints\Regex;

class CustomImageForm extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $numberConstraint = [
            'required' => true,
            'constraints' => [
                new Regex([
                    'pattern' => '/[+-]?([0-9]*[.])?[0-9]+/'
                ])
            ]
        ];

        $builder
            ->add('imageFile', FileType::class, [
                'required' => true,
                'label' => false,
                'constraints' => [
                    new Image([
                        'maxSize' => '5M'
                    ])
                ]
            ])
            ->add('angle', HiddenType::class, [
                'required' => true,
                'constraints' => [
                    new Regex([
                        'pattern' => '/\d/'
                    ])
                ]
            ])
            ->add('scale', HiddenType::class,
                $numberConstraint)
            ->add('start_x', HiddenType::class,
                $numberConstraint)
            ->add('start_y', HiddenType::class,
                $numberConstraint)
            ->add('size_w', HiddenType::class,
                $numberConstraint)
            ->add('size_h', HiddenType::class,
                $numberConstraint);
    }


    public function getBlockPrefix()
    {
        return '';
    }
}