//initialize the input pin for the potentiometer
const int potPin = A4;

//initialize the value of the inputs
int potVal = 0;
  
void setup() {
  //set the first potentiometer as an input
  pinMode(potPin, INPUT); 

  //begin serial monitor
  Serial.begin(9600);
}

void loop() {
  //read the analog value of the potentiometer
  potVal = analogRead(potPin);
  delay(1);

  //print the value of the potentiometer to serial
  Serial.println(potVal);
   
}
