@Library('Shared') _
def config = securityConfig("securelooper/learner-insights-backend:${BUILD_NUMBER}",'')

pipeline { 
    agent any
    stages {
        stage("Security Scans") {
            steps {
                script {
                    securityScan()
                }
            }
        }

        stage('Unit Test') {
            agent {
                docker {
                    image 'node:22-slim'
                }
            }
            steps {
                sh '''
                    npm install --cache .npm-cache
                    npm test
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${config.DOCKER_IMAGE}")
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    pushDockerImage("${config.DOCKER_IMAGE}", "${config.DOCKER_CREDENTIALS_ID}")
                }
            }
        }

        stage('Trigger Deployment') {
            steps {
                echo "Triggering the deployment pipeline..."
                build job: 'deploy-helm',
                parameters: [
                    string(name: 'SERVICE_NAME', value: 'backend'), // Change to 'backend' for the backend repo
                    string(name: 'IMAGE_TAG', value: BUILD_NUMBER)
                ],
                wait: true // Proceeds without waiting for the deployment to finish
            }
        }
    }

    post {
        always {
            echo 'CI Pipeline finished.'
            // Clean up the Docker image from the Jenkins agent to save space.
            sh "docker rmi ${config.DOCKER_IMAGE}:${BUILD_NUMBER} || true"
        }
    }
}