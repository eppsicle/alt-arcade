//initialize the input pin for the potentiometer
const int pedalPin = A0;

//initialize the value of the inputs
int pedalVal = 0;
  

void setup() {
  //set the first potentiometer as an input
  pinMode(pedalPin, INPUT); 

  //begin serial monitor
  Serial.begin(9600);
}

void loop() {
  //read the analog value of the potentiometer
  pedalVal = analogRead(pedalPin);
  delay(1);

  //print the value of the potentiometer to serial
  Serial.println(pedalVal);
}
