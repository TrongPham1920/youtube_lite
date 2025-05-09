pipeline {
    agent any

    environment {
        DOCKER_IMAGE       = 'trong19/ytt_be'
        DOCKER_TAG         = 'latest'  
        TELEGRAM_BOT_TOKEN = credentials('TELEGRAM_BOT_TOKEN')
        TELEGRAM_CHAT_ID   = credentials('TELEGRAM_CHAT_ID')
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/TrongPham1920/youtube_lite.git'
            }
        }

        stage('Prepare Config') {
            steps {
                echo '🧪 Running tests...' 
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "🚀 Building ${DOCKER_IMAGE}:${DOCKER_TAG}"
                    docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                }
            }
        }

        stage('Run Tests') {
            steps {
                echo '🧪 Running tests...' 
                // Nếu có test script, thay echo bằng sh 'npm test' hoặc tương tự
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    echo "📦 Pushing ${DOCKER_IMAGE}:${DOCKER_TAG} to Docker Hub..."
                    docker.withRegistry('https://index.docker.io/v1/', 'docker-hub-credentials') {
                        docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}").push()
                    }
                }
            }
        }

        stage('Deploy to Production') {
            steps {
                script {
                    echo '🚢 Deploying to Production...'

                    sh """
                    #!/bin/bash
                    set -e

                    echo '🛑 Stopping old container (ytt_be) if exists...'
                    docker stop ytt_be || echo '→ no running container'

                    echo '🗑 Removing old container...'
                    docker rm ytt_be   || echo '→ no container to remove'

                    echo '⬇️ Pulling new image ${DOCKER_IMAGE}:${DOCKER_TAG}...'
                    docker pull ${DOCKER_IMAGE}:${DOCKER_TAG}

                    echo '🏃‍♂️ Starting new container...'
                    docker run -d \
                        --name ytt_be \
                        --env-file /root/.envytb \
                        -e NODE_ENV=production \
                        -p 5000:5000 \
                        ${DOCKER_IMAGE}:${DOCKER_TAG}

                    echo '✅ Deployment be_ytb complete.'
                    """
                }
            }
        }
    }

    post {
        success {
            cleanWs()
            sendTelegramMessage("✅ Build be_ytb #${BUILD_NUMBER} was successful! ✅")
        }
        failure {
            cleanWs()
            sendTelegramMessage("❌ Build be_ytb #${BUILD_NUMBER} failed. ❌")
        }
    }
}

// Hàm gửi Telegram notification
def sendTelegramMessage(String message) {
    withEnv(["MESSAGE=${message}"]) {
        sh """
        curl -s -X POST https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage \
             -d chat_id=$TELEGRAM_CHAT_ID \
             -d text="$MESSAGE"
        """
    }
}
