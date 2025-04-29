cmake_minimum_required(VERSION 3.16)
project(RateCalculator)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Оптимизация компиляции
if(NOT CMAKE_BUILD_TYPE)
    set(CMAKE_BUILD_TYPE Release)
endif()

# Подключаем PkgConfig
find_package(PkgConfig REQUIRED)

# Находим Kafka (librdkafka C++)
pkg_check_modules(RDKAFKA_CPP REQUIRED IMPORTED_TARGET rdkafka++)

message(STATUS "RDKAFKA_CPP_INCLUDE_DIRS: ${RDKAFKA_CPP_INCLUDE_DIRS}")

# Находим PostgreSQL (libpq)
pkg_check_modules(PostgreSQL REQUIRED IMPORTED_TARGET libpq)

# Находим libpqxx (если pkg-config файл доступен)
pkg_check_modules(PQXX QUIET libpqxx)
if(NOT PQXX_FOUND)
    message(WARNING "pkg-config не смог найти libpqxx, используем ручной путь.")
    set(PQXX_INCLUDE_DIRS "/usr/include")  # Заголовочные файлы обычно находятся здесь в Alpine
    set(PQXX_LIBRARIES "pqxx")
endif()

# Добавляем исполняемый файл
add_executable(rate_calculator main.cpp)

# Указываем директории с заголовочными файлами
target_include_directories(rate_calculator PRIVATE 
    ${RDKAFKA_CPP_INCLUDE_DIRS} 
    ${PostgreSQL_INCLUDE_DIRS}
    /usr/local/include      # Для libpqxx (если собирается из исходников)
)

# Линкуем библиотеки Kafka, PostgreSQL и libpqxx
target_link_libraries(rate_calculator PRIVATE 
    PkgConfig::RDKAFKA_CPP 
    PkgConfig::PostgreSQL
    ${PQXX_LIBRARIES}
)

# Указываем пути к библиотекам (если PkgConfig не находит их)
link_directories(${RDKAFKA_LIBRARY_DIRS} ${PostgreSQL_LIBRARY_DIRS})

# Добавляем флаги компиляции (для совместимости с Alpine Linux)
target_compile_options(rate_calculator PRIVATE ${RDKAFKA_CFLAGS_OTHER} ${PostgreSQL_CFLAGS_OTHER})
