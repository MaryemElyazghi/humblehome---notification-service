package com.humble.product.service;

import com.humble.product.dto.ProductDTO;
import com.humble.product.entity.Image;
import com.humble.product.entity.Product;
import com.humble.product.mapper.ProductMapper;
import com.humble.product.repository.ImageRepository;
import com.humble.product.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepo;

    @Autowired
    private ProductMapper mapper;

    @Autowired
    private ImageRepository imageRepo;

    public ProductDTO createProduct(Product p) {
        return mapper.toDTO(productRepo.save(p));
    }

    @Transactional
    public ProductDTO updateProduct(Long id, Product product) {
        Product existingProduct = productRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Mettre à jour les champs
        if (product.getName() != null) {
            existingProduct.setName(product.getName());
        }
        if (product.getBrand() != null) {
            existingProduct.setBrand(product.getBrand());
        }
        if (product.getPrice() != null) {
            existingProduct.setPrice(product.getPrice());
        }
        // Toujours mettre à jour l'inventory (0 est une valeur valide)
        existingProduct.setInventory(product.getInventory());
        if (product.getDescription() != null) {
            existingProduct.setDescription(product.getDescription());
        }
        if (product.getCategory() != null) {
            existingProduct.setCategory(product.getCategory());
        }

        // Les images restent inchangées lors de la mise à jour du produit
        // Pour supprimer des images, utilisez l'endpoint DELETE /images/{id}
        // Pour ajouter des images, utilisez l'endpoint POST /images

        return mapper.toDTO(productRepo.save(existingProduct));
    }

    public ProductDTO getProduct(Long id) {
        Product p = productRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        return mapper.toDTO(p);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Supprimer tous les fichiers physiques des images associées
        List<Image> images = imageRepo.findByProductId(id);
        for (Image image : images) {
            if (image.getFilePath() != null) {
                try {
                    Path filePath = Paths.get(image.getFilePath());
                    Files.deleteIfExists(filePath);
                } catch (IOException e) {
                    // Log l'erreur mais continue la suppression
                    System.err.println("Erreur lors de la suppression du fichier: " + image.getFilePath() + " - " + e.getMessage());
                }
            }
        }

        // Supprimer le produit (les images seront supprimées automatiquement grâce à cascade = CascadeType.ALL)
        productRepo.delete(product);
    }

    public List<ProductDTO> getAll() {
        return productRepo.findAll()
                .stream().map(mapper::toDTO).toList();
    }

    public Product getProduit(Long id) {
        return productRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit introuvable avec ID : " + id));
    }



}

