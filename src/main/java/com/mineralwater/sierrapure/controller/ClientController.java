package com.mineralwater.sierrapure.controller;

import com.mineralwater.sierrapure.dto.ApiResponse;
import com.mineralwater.sierrapure.dto.ClientDTO;
import com.mineralwater.sierrapure.model.Client;
import com.mineralwater.sierrapure.model.ImageAsset;
import com.mineralwater.sierrapure.service.ClientService;
import com.mineralwater.sierrapure.service.ImageStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;
    private final ImageStorageService imageStorageService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ClientDTO>>> getAll(
            @RequestParam(required = false) String segment) {
        List<ClientDTO> clients = segment != null
                ? clientService.getBySegment(segment).stream().map(ClientDTO::from).toList()
                : clientService.getAllActive().stream().map(ClientDTO::from).toList();
        return ResponseEntity.ok(ApiResponse.success(clients, "Clients fetched successfully"));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<ClientDTO>>> getFeatured() {
        List<ClientDTO> list = clientService.getFeatured().stream().map(ClientDTO::from).toList();
        return ResponseEntity.ok(ApiResponse.success(list, "Featured clients fetched"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ClientDTO>> getById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(
                ClientDTO.from(clientService.getById(id)), "Client fetched successfully"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ClientDTO>> create(@RequestBody Client client) {
        return ResponseEntity.ok(ApiResponse.success(
                ClientDTO.from(clientService.create(client)), "Client created successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ClientDTO>> update(
            @PathVariable String id, @RequestBody Client client) {
        return ResponseEntity.ok(ApiResponse.success(
                ClientDTO.from(clientService.update(id, client)), "Client updated successfully"));
    }

    /**
     * Upload logo and link it to an existing client.
     * POST /api/v1/clients/{id}/logo
     */
    @PostMapping(value = "/{id}/logo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ClientDTO>> uploadLogo(
            @PathVariable String id,
            @RequestParam("file") MultipartFile file) throws IOException {

        Client client = clientService.getById(id);
        ImageAsset asset = imageStorageService.uploadClientLogo(file, client.getName());
        Client updated = clientService.updateLogo(id, asset.getPublicUrl(), asset.getStoredName());
        return ResponseEntity.ok(ApiResponse.success(ClientDTO.from(updated), "Client logo uploaded and linked"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> delete(@PathVariable String id) {
        clientService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(id, "Client deleted successfully"));
    }
}
