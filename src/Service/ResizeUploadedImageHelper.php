<?php
/**
 * Created by PhpStorm.
 * User: nigel
 * Date: 27/03/2019
 * Time: 11:47
 */

namespace App\Service;

use Gedmo\Sluggable\Util\Urlizer;
use League\Flysystem\FilesystemInterface;
use Liip\ImagineBundle\Service\FilterService;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class ResizeUploadedImageHelper
{
    private const DISPLAY_DIRECTORY = 'uploads';

    private $filesystem;
    /**
     * @var FilterService
     */
    private $filterService;

    public function __construct(FilesystemInterface $publicFilesystemBinding, FilterService $filterService)
    {
        $this->filesystem = $publicFilesystemBinding;
        $this->filesystem->createDir(self::DISPLAY_DIRECTORY);
        $this->filterService = $filterService;
    }

    /**
     * @param $formData
     * @return string
     * @throws \League\Flysystem\FileExistsException
     * @throws \League\Flysystem\FileNotFoundException
     */
    public function processUploadedImage($formData): string
    {
        /** @var UploadedFile $uploadedFile */
        $uploadedFile = $formData['imageFile'];

        $clientOriginalFileName = pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_FILENAME);
        $extensionLessFileName = uniqid(Urlizer::urlize($clientOriginalFileName) . '_', true);

        $originalFile = self::DISPLAY_DIRECTORY . '/' . $extensionLessFileName . '.' . $uploadedFile->guessExtension();

        $this->filesystem->write($originalFile, file_get_contents($uploadedFile->getPathname()));

        $processedImage = $this->processImage($originalFile, $formData);
        $this->filesystem->delete($originalFile);
        $this->filesystem->rename($processedImage, $originalFile);
        return $originalFile;

    }

    private function processImage($originalFile, $formData): string
    {
        $runtimeConfig = [
            'scale' => [
                'to' => $formData['scale'],
            ],
            'rotate' => [
                'angle' => $formData['angle']
            ],
            'custom_crop_filter' => [
                'size' => [$formData['size_w'], $formData['size_h']],
                'start' => [$formData['start_x'], $formData['start_y']]
            ]
        ];

        return $this->filterService->getUrlOfFilteredImageWithRuntimeFilters(
            $originalFile,
            'my_thumb',
            $runtimeConfig
        );
    }
}