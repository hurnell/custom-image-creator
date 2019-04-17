<?php

namespace App\Controller;

use App\Form\Type\CustomImageForm;
use App\Service\ResizeUploadedImageHelper;
use League\Flysystem\FileExistsException;
use League\Flysystem\FileNotFoundException;
use Imagine\Exception\RuntimeException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class CustomImageController extends AbstractController
{
    /**
     * @Route("/", name="custom_image_homepage")
     */
    public function index(): Response
    {
        return $this->render('custom_image/index.html.twig', [
            'controller_name' => 'CustomImageController',
        ]);
    }


    /**
     * @Route("get-custom-image-form", name="get_custom_image_form", options={"expose"=true})
     * @return Response
     */
    public function getCustomImageFormAction(): Response
    {
        $form = $this->createForm(CustomImageForm::class, null, [
            'action' => $this->generateUrl('upload_image'),
            'csrf_protection' => false,
        ]);
        return $this->render('custom_image/get-custom-image-form.html.twig', [
            'customImageForm' => $form->createView(),
        ]);
    }


    /**
     * @Route("/upload-image", name="upload_image", methods={"post"})
     * @param Request $request
     * @param ResizeUploadedImageHelper $uploadedImageHelper
     * @return JsonResponse
     */
    public function uploadImageAction(Request $request, ResizeUploadedImageHelper $uploadedImageHelper): JsonResponse
    {
        $form = $this->createForm(CustomImageForm::class, null, [
            'csrf_protection' => false,
        ]);
        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            try {
                $imageUrl = $uploadedImageHelper->processUploadedImage($form->getData());
                return $this->json([
                    'url' => $imageUrl
                ]);
            } catch (FileExistsException |FileNotFoundException|RuntimeException $e) {
                return $this->json([
                    'message' => 'Problem Creating Image!' . $e->getMessage()
                ], 400);
            }
        }
        $errors = $form->getErrors();
        return $this->json([
            'message' => 'Problem Posting Form!' . $errors->__toString()
        ], 400);
    }
}
