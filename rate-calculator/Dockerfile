# Первый этап: сборка
FROM alpine:latest AS builder

# Устанавливаем зависимости для сборки
RUN apk add --no-cache \
    build-base \
    cmake \
    git \
    linux-headers \
    wget \
    librdkafka-dev \
    postgresql-dev

# Сбор libpqxx из исходников
# Версию можно изменить по необходимости
ENV LIBPQXX_VERSION=7.10.0
RUN wget https://github.com/jtv/libpqxx/archive/refs/tags/${LIBPQXX_VERSION}.tar.gz && \
    tar xf ${LIBPQXX_VERSION}.tar.gz && \
    cd libpqxx-${LIBPQXX_VERSION} && \
    mkdir build && cd build && \
    cmake .. -DCMAKE_BUILD_TYPE=Release && \
    make -j$(nproc) && \
    make install

# Создаем рабочую директорию
WORKDIR /app

# Копируем исходный код (включая CMakeLists.txt и main.cpp)
COPY . .

# Собираем приложение
RUN cmake -DCMAKE_BUILD_TYPE=Release .
RUN make -j$(nproc)

# Второй этап: минимальный контейнер
FROM alpine:latest

# Устанавливаем необходимые библиотеки для выполнения
RUN apk add --no-cache \
    librdkafka \
    postgresql-libs

# Копируем скомпилированный бинарник
COPY --from=builder /app/rate_calculator /usr/local/bin/rate_calculator

# Запускаем приложение
CMD ["/usr/local/bin/rate_calculator"]
