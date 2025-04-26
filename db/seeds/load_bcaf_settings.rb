# frozen_string_literal: true

BcafSetting.destroy_all
BcafSetting.create(
  image_url: 'https://bcaf-comic-streaming-titles.s3-us-west-1.amazonaws.com/bcaf-digital-images/poster2Final-2k1500.jpg',
  logo_url: 'https://bcaf-comic-streaming-titles.s3-us-west-1.amazonaws.com/bcaf-digital-images/bcafDigitalLogo-00aeef.png',
  slogan: 'Welcome to BCAF.digital!',
  tagline: 'Black & Brown Comix Arts Festival online digital comics.',
  selection_image_url: 'https://bcaf-comic-streaming-titles.s3-us-west-1.amazonaws.com/bcaf-digital-images/GoldenGateBridge-001-1500.jpg'
)
