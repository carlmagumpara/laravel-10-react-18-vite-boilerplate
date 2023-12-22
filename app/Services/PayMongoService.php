<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Luigel\Paymongo\Facades\Paymongo;

class PayMongoService
{
    /**
     * The app instance.
     *
     * @var
     */
    public function __construct()
    {
    }

    public function getPaymentIntent($id)
    {
        $paymentIntent = Paymongo::paymentIntent()->find($id);

        return $this->dismount($paymentIntent);
    }

    public function card(array $payload = [])
    {
        try {
            $paymentMethod = Paymongo::paymentMethod()->create([
                'type' => 'card',
                'details' => [
                    'card_number' => (string) $payload['card_number'],
                    'exp_month' => (int) $payload['expiration_month'],
                    'exp_year' => (int) $payload['expiration_year'],
                    'cvc' => (string) $payload['cvc'],
                ],
                'billing' => [
                    'name' => $payload['card_holder'],
                    'email' => $payload['email'],
                ],
            ]);
            $paymentIntent = Paymongo::paymentIntent()->create([
                'amount' => $this->checkoutAmount($payload['amount'], config('payment-fees.paymongo.card.other'), config('payment-fees.paymongo.card.percentage')),
                'payment_method_allowed' => [
                    'card',
                ],
                'payment_method_options' => [
                    'card' => [
                        'request_three_d_secure' => 'any',
                    ],
                ],
                'description' => $payload['description'],
                'statement_descriptor' => $payload['statement_descriptor'],
                'currency' => $payload['currency'],
            ]);

            $payment = Paymongo::paymentIntent()->find($this->dismount($paymentIntent)['id'])->attach($this->dismount($paymentMethod)['id']);

            return $this->dismount($payment);
        } catch (Exception $e) {
            return $e;
        }
    }

    public function source($type = '', array $payload = [])
    {
        try {
            $this->webHook();
            $source = Paymongo::source()->create([
                'type' => $type,
                'amount' => $payload['amount'],
                'currency' => $payload['currency'],
                'redirect' => [
                    'success' => $this->redirectUrl('success', $payload['payment_id'] ?? ''),
                    'failed' => $this->redirectUrl('failed', $payload['payment_id'] ?? ''),
                ],
                'billing' => [
                    'name' => $payload['name'],
                    'email' => $payload['email'],
                ],
            ]);

            return $this->dismount($source);
        } catch (Exception $e) {

            \Log::info($e);

            return $e;
        }
    }

    public function payment(array $payload = [])
    {
        try {
            $payment = Paymongo::payment()
            ->create([
                'amount' => $payload['amount'],
                'currency' => $payload['currency'],
                'description' => $payload['description'],
                'statement_descriptor' => $payload['statement_descriptor'],
                'source' => [
                    'id' => $payload['id'],
                    'type' => $payload['type'],
                ],
            ]);

            return $this->dismount($payment);
        } catch (Exception $e) {

            \Log::info($e);

            return $e;
        }
    }

    public function redirectUrl($status = '', $payment_id = null)
    {
        return url('/api/payment/status').http_build_query(['payment_id' => $payment_id, 'status' => $status]);
    }

    public function webHook()
    {
        try {
            $webhooks = Paymongo::webhook()->all();

            \Log::info($webhooks);

            Paymongo::webhook()->create([
                'url' => url('/api/payment/paymongo/postback'),
                'events' => [
                    'source.chargeable',
                ],
            ]);
               
            \Log::info('Webhook Created');
            
            return true;
        } catch (Exception $e) {

            \Log::info($e);

            return $e;
        }
    }

    public function getPaymentFee($amount = 0, $other_fee = 0, $percentage = 0)
    {
        return ($amount * $percentage) + $other_fee;
    }

    public function getTotalAmount($amount = 0, $other_fee = 0, $percentage = 0)
    {
        return $this->getPaymentFee($amount, $other_fee, $percentage) + $amount;
    }

    public function getTotalPaymentFee($amount = 0, $other_fee = 0, $percentage = 0)
    {
        return round($this->getPaymentFee($this->getTotalAmount($amount, $other_fee, $percentage), $other_fee, $percentage));
    }

    public function checkoutAmount($amount = 0, $other_fee = 0, $percentage = 0)
    {
        return (int) ($this->getTotalPaymentFee($amount, $other_fee, $percentage) + $amount);
    }

    public function dismount($object)
    {
        $reflectionClass = new \ReflectionClass(get_class($object));
        $array = [];
        foreach ($reflectionClass->getProperties() as $property) {
            $property->setAccessible(true);
            $array[$property->getName()] = $property->getValue($object);
            $property->setAccessible(false);
        }

        return $array;
    }
}
