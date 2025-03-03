// package ru.securitytrip.user_service;

// import org.junit.jupiter.api.Test;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
// import org.springframework.boot.test.mock.mockito.MockBean;
// import org.springframework.http.MediaType;
// import org.springframework.test.web.servlet.MockMvc;

// import ru.securitytrip.user_service.controller.UserController;
// import ru.securitytrip.user_service.model.User;
// import ru.securitytrip.user_service.service.UserService;

// import java.util.Arrays;
// import java.util.Optional;

// import static org.mockito.BDDMockito.given;
// import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
// import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

// @WebMvcTest(UserController.class)
// class UserControllerTest {

//     @Autowired
//     private MockMvc mockMvc;

//     @MockBean
//     private UserService userService;

//     @Test
//     void getAllUsers() throws Exception {
//         User user = new User();
//         user.setId(1L);
//         user.setName("John Doe");
//         user.setEmail("john.doe@example.com");

//         given(userService.findAll()).willReturn(Arrays.asList(user));

//         mockMvc.perform(get("/users"))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$[0].name").value(user.getName()));
//     }

//     @Test
//     void getUserById() throws Exception {
//         User user = new User();
//         user.setId(1L);
//         user.setName("John Doe");
//         user.setEmail("john.doe@example.com");

//         given(userService.findById(1L)).willReturn(Optional.of(user));

//         mockMvc.perform(get("/users/1"))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$.name").value(user.getName()));
//     }

//     @Test
//     void createUser() throws Exception {
//         User user = new User();
//         user.setName("John Doe");
//         user.setEmail("john.doe@example.com");

//         given(userService.save(user)).willReturn(user);

//         mockMvc.perform(post("/users")
//                 .contentType(MediaType.APPLICATION_JSON)
//                 .content("{\"name\": \"John Doe\", \"email\": \"john.doe@example.com\"}"))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$.name").value(user.getName()));
//     }

//     @Test
//     void updateUser() throws Exception {
//         User user = new User();
//         user.setId(1L);
//         user.setName("John Doe");
//         user.setEmail("john.doe@example.com");

//         given(userService.findById(1L)).willReturn(Optional.of(user));
//         given(userService.save(user)).willReturn(user);

//         mockMvc.perform(put("/users/1")
//                 .contentType(MediaType.APPLICATION_JSON)
//                 .content("{\"name\": \"John Doe Updated\", \"email\": \"john.doe@example.com\"}"))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$.name").value("John Doe Updated"));
//     }

//     @Test
//     void deleteUser() throws Exception {
//         User user = new User();
//         user.setId(1L);
//         user.setName("John Doe");
//         user.setEmail("john.doe@example.com");

//         given(userService.findById(1L)).willReturn(Optional.of(user));

//         mockMvc.perform(delete("/users/1"))
//                 .andExpect(status().isOk());
//     }
// }