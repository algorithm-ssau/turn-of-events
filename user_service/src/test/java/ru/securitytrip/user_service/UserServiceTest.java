// package ru.securitytrip.user_service;

// import org.junit.jupiter.api.Test;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.mockito.MockitoAnnotations;
// import ru.securitytrip.user_service.model.User;
// import ru.securitytrip.user_service.repository.UserRepository;
// import ru.securitytrip.user_service.service.UserService;

// import java.util.Arrays;
// import java.util.List;
// import java.util.Optional;

// import static org.junit.jupiter.api.Assertions.assertEquals;
// import static org.mockito.BDDMockito.given;

// class UserServiceTest {

//     @Mock
//     private UserRepository userRepository;

//     @InjectMocks
//     private UserService userService;

//     public UserServiceTest() {
//         MockitoAnnotations.openMocks(this);
//     }

//     @Test
//     void findAll() {
//         User user = new User();
//         user.setId(1L);
//         user.setName("John Doe");
//         user.setEmail("john.doe@example.com");

//         given(userRepository.findAll()).willReturn(Arrays.asList(user));

//         List<User> users = userService.findAll();
//         assertEquals(1, users.size());
//         assertEquals(user.getName(), users.get(0).getName());
//     }

//     @Test
//     void findById() {
//         User user = new User();
//         user.setId(1L);
//         user.setName("John Doe");
//         user.setEmail("john.doe@example.com");

//         given(userRepository.findById(1L)).willReturn(Optional.of(user));

//         Optional<User> foundUser = userService.findById(1L);
//         assertEquals(user.getName(), foundUser.get().getName());
//     }

//     @Test
//     void save() {
//         User user = new User();
//         user.setName("John Doe");
//         user.setEmail("john.doe@example.com");

//         given(userRepository.save(user)).willReturn(user);

//         User savedUser = userService.save(user);
//         assertEquals(user.getName(), savedUser.getName());
//     }

//     @Test
//     void deleteById() {
//         User user = new User();
//         user.setId(1L);
//         user.setName("John Doe");
//         user.setEmail("john.doe@example.com");

//         userService.deleteById(1L);
//     }
// }
