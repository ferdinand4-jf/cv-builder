pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = 'your-docker-registry'
        DOCKER_IMAGE_BACKEND = 'cv-builder-backend'
        DOCKER_IMAGE_FRONTEND = 'cv-builder-frontend'
        DOCKER_IMAGE_NGINX = 'cv-builder-nginx'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup Environment') {
            steps {
                sh 'cp .env.example .env'
                sh 'npm install --prefix backend'
                sh 'npm install --prefix frontend'
            }
        }

        stage('Lint') {
            steps {
                sh 'npm run lint --prefix backend'
                sh 'npm run lint --prefix frontend'
            }
        }

        stage('Test') {
            steps {
                sh 'npm run test --prefix backend'
                sh 'npm run test --prefix frontend'
            }
            post {
                always {
                    junit 'backend/test-results/**/*.xml'
                    junit 'frontend/test-results/**/*.xml'
                }
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build --prefix backend'
                sh 'npm run build --prefix frontend'
            }
        }

        stage('Docker Build') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE_BACKEND}:${IMAGE_TAG}", "./backend")
                    docker.build("${DOCKER_IMAGE_FRONTEND}:${IMAGE_TAG}", "./frontend")
                    docker.build("${DOCKER_IMAGE_NGINX}:${IMAGE_TAG}", "./nginx")
                }
            }
        }

        stage('Docker Tag') {
            steps {
                script {
                    sh "docker tag ${DOCKER_IMAGE_BACKEND}:${IMAGE_TAG} ${DOCKER_REGISTRY}/${DOCKER_IMAGE_BACKEND}:${IMAGE_TAG}"
                    sh "docker tag ${DOCKER_IMAGE_FRONTEND}:${IMAGE_TAG} ${DOCKER_REGISTRY}/${DOCKER_IMAGE_FRONTEND}:${IMAGE_TAG}"
                    sh "docker tag ${DOCKER_IMAGE_NGINX}:${IMAGE_TAG} ${DOCKER_REGISTRY}/${DOCKER_IMAGE_NGINX}:${IMAGE_TAG}"
                    
                    if (env.BRANCH_NAME == 'main') {
                        sh "docker tag ${DOCKER_IMAGE_BACKEND}:${IMAGE_TAG} ${DOCKER_REGISTRY}/${DOCKER_IMAGE_BACKEND}:latest"
                        sh "docker tag ${DOCKER_IMAGE_FRONTEND}:${IMAGE_TAG} ${DOCKER_REGISTRY}/${DOCKER_IMAGE_FRONTEND}:latest"
                        sh "docker tag ${DOCKER_IMAGE_NGINX}:${IMAGE_TAG} ${DOCKER_REGISTRY}/${DOCKER_IMAGE_NGINX}:latest"
                    }
                }
            }
        }

        stage('Docker Push') {
            steps {
                script {
                    withDockerRegistry([credentialsId: 'docker-credentials']) {
                        sh "docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE_BACKEND}:${IMAGE_TAG}"
                        sh "docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE_FRONTEND}:${IMAGE_TAG}"
                        sh "docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE_NGINX}:${IMAGE_TAG}"
                        
                        if (env.BRANCH_NAME == 'main') {
                            sh "docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE_BACKEND}:latest"
                            sh "docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE_FRONTEND}:latest"
                            sh "docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE_NGINX}:latest"
                        }
                    }
                }
            }
        }

        stage('Deploy to Staging') {
            when {
                expression { env.BRANCH_NAME == 'develop' || env.BRANCH_NAME == 'main' }
            }
            steps {
                script {
                    sh """
                        docker-compose -f docker-compose.staging.yml pull
                        docker-compose -f docker-compose.staging.yml up -d
                        docker system prune -f
                    """
                }
            }
        }

        stage('Deploy to Production') {
            when {
                expression { env.BRANCH_NAME == 'main' }
            }
            steps {
                input message: 'Deploy to production?', ok: 'Yes'
                script {
                    sh """
                        docker-compose -f docker-compose.production.yml pull
                        docker-compose -f docker-compose.production.yml up -d
                        docker system prune -f
                    """
                }
            }
        }
    }

    post {
        success {
            emailext (
                subject: "✅ Build Success: ${env.JOB_NAME} - ${env.BUILD_NUMBER}",
                body: "The build was successful. Check the console output for more details.",
                to: 'team@example.com'
            )
        }
        failure {
            emailext (
                subject: "❌ Build Failed: ${env.JOB_NAME} - ${env.BUILD_NUMBER}",
                body: "The build failed. Please check the console output for errors.",
                to: 'team@example.com'
            )
        }
    }
}