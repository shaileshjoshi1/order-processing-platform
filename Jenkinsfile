pipeline {
    agent any

    stages {
        stage('Install') {
            steps {
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test -- --passWithNoTests'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t order-processing-platform:latest .'
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    docker rm -f order-processing-app || true

                    docker run -d \
                      --name order-processing-app \
                      -p 3000:3000 \
                      --env-file .env \
                      -v /var/jenkins_home/.aws:/root/.aws:ro \
                      order-processing-platform:latest
                '''
            }
        }
    }
}